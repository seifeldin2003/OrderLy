"""
tests/test_checkout.py
======================
Boundary and failure-path tests for the Checkout / Order slice
and Role-Based Access Control (RBAC).
Maps to Phase 2 Gherkin scenarios 1.4, 1.5, 1.7, 1.9.
"""


# ══════════════════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════════════════

CHECKOUT_PAYLOAD = {
    "delivery_address": "123 Main Street",
    "phone": "01000000000",
    "payment_method": "CashOnDelivery",
}


def add_first_item_to_cart(seeded_client, customer_token, quantity=1):
    """Add the first available menu item to the customer's cart."""
    menu = seeded_client.get("/api/menu/items")
    item_id = menu.json()[0]["id"]
    seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": quantity},
        headers=customer_token,
    )
    return item_id


def place_order(seeded_client, customer_token, extra=None):
    """Place an order with the default checkout payload."""
    payload = {**CHECKOUT_PAYLOAD, **(extra or {})}
    return seeded_client.post("/api/orders", json=payload, headers=customer_token)


# ══════════════════════════════════════════════════════════════════════════════
# Checkout — Failure Paths  (Gap G-3)
# ══════════════════════════════════════════════════════════════════════════════

def test_checkout_empty_cart_returns_400(seeded_client, customer_token):
    """
    Padlock O-1 / Gap G-3:
    Attempting checkout with an empty cart must return 400.
    Gherkin: 'Scenario: Checkout with empty cart'
    """
    resp = place_order(seeded_client, customer_token)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Cart cannot be empty"


def test_checkout_invalid_payment_method_returns_400(seeded_client, customer_token):
    """
    Padlock O-2:
    An unrecognised payment method must return 400 (not 422).
    Gherkin: 'Scenario: Checkout with invalid payment method'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token, {"payment_method": "Bitcoin"})
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Invalid payment method"


# ══════════════════════════════════════════════════════════════════════════════
# Checkout — Happy Path / Promo
# ══════════════════════════════════════════════════════════════════════════════

def test_checkout_applies_save10_discount(seeded_client, customer_token):
    """
    Padlock O-3:
    SAVE10 promo code must produce a 10% discount calculated server-side.
    Gherkin: 'Scenario: Checkout with promo code SAVE10'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token, {"promo_code": "SAVE10"})
    assert resp.status_code == 201
    data = resp.json()
    expected_discount = round(data["subtotal"] * 0.10, 2)
    assert data["discount"] == expected_discount


def test_checkout_save10_is_case_insensitive(seeded_client, customer_token):
    """
    Padlock O-4:
    'save10' (lowercase) must apply the same 10% discount as 'SAVE10'.
    QA Audit: 'Promo code case sensitivity'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token, {"promo_code": "save10"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["discount"] > 0


def test_checkout_order_number_format(seeded_client, customer_token):
    """
    Padlock O-8:
    Order number must match pattern ORD-YYYYMMDD-XXXX.
    Gherkin: 'Scenario: Successful checkout with valid cart'
    """
    import re
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token)
    assert resp.status_code == 201
    order_number = resp.json()["order_number"]
    assert re.match(r"^ORD-\d{8}-\d{4}$", order_number), (
        f"Order number '{order_number}' does not match ORD-YYYYMMDD-XXXX"
    )


def test_checkout_decrements_stock(seeded_client, customer_token):
    """
    Padlock O-6:
    Stock must decrease by exactly the ordered quantity after checkout.
    QA Audit: 'Reliable inventory updates'
    """
    menu = seeded_client.get("/api/menu/items")
    item = menu.json()[0]
    stock_before = item["stock"]

    seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item["id"], "quantity": 1},
        headers=customer_token,
    )
    place_order(seeded_client, customer_token)

    updated = seeded_client.get(f"/api/menu/items/{item['id']}")
    stock_after = updated.json()["stock"]
    assert stock_after == stock_before - 1


def test_checkout_clears_cart(seeded_client, customer_token):
    """
    Padlock O-6:
    Cart must be empty after a successful order is placed.
    Gherkin: 'Scenario: Successful checkout with valid cart'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    place_order(seeded_client, customer_token)

    cart = seeded_client.get("/api/cart", headers=customer_token)
    assert cart.json()["items"] == []


def test_checkout_delivery_fee_is_300(seeded_client, customer_token):
    """
    Padlock O-5:
    delivery_fee must be exactly 3.0 — the server-side constant.
    QA Audit: 'Accurate total pricing'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token)
    assert resp.status_code == 201
    assert resp.json()["delivery_fee"] == 3.0


def test_checkout_total_formula(seeded_client, customer_token):
    """
    Padlock O-3 + O-5:
    total must equal subtotal - discount + delivery_fee exactly.
    """
    add_first_item_to_cart(seeded_client, customer_token)
    resp = place_order(seeded_client, customer_token, {"promo_code": "SAVE10"})
    assert resp.status_code == 201
    data = resp.json()
    expected_total = round(data["subtotal"] - data["discount"] + data["delivery_fee"], 2)
    assert data["total"] == expected_total


# ══════════════════════════════════════════════════════════════════════════════
# Order Cancellation  (Gap G-5)
# ══════════════════════════════════════════════════════════════════════════════

def test_cancel_pending_order_succeeds(seeded_client, customer_token):
    """
    Padlock O-9:
    A Pending order can be cancelled by the customer.
    Gherkin: 'Scenario: Customer cancels order in cancellable status'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    order = place_order(seeded_client, customer_token)
    order_id = order.json()["id"]

    resp = seeded_client.put(
        f"/api/orders/{order_id}/cancel",
        headers=customer_token,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "Cancelled"


def test_cancel_preparing_order_returns_400(seeded_client, customer_token, admin_token):
    """
    Padlock O-9 / Gap G-5:
    An order in 'Preparing' status must NOT be cancellable — returns 400.
    Gherkin: 'Scenario: Customer cancels order in non-cancellable status'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    order = place_order(seeded_client, customer_token)
    order_id = order.json()["id"]

    # Admin advances order to Preparing
    seeded_client.put(
        f"/api/admin/orders/{order_id}/status",
        json={"status": "Preparing"},
        headers=admin_token,
    )

    resp = seeded_client.put(
        f"/api/orders/{order_id}/cancel",
        headers=customer_token,
    )
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Order can no longer be cancelled"


# ══════════════════════════════════════════════════════════════════════════════
# RBAC  (Gap G-6)
# ══════════════════════════════════════════════════════════════════════════════

def test_customer_cannot_access_admin_dashboard(seeded_client, customer_token):
    """
    Padlock R-1 / Gap G-6:
    A customer JWT must be rejected with 403 on any /api/admin/* route.
    Gherkin: 'Scenario: Customer accessing admin routes'
    """
    resp = seeded_client.get("/api/admin/dashboard", headers=customer_token)
    assert resp.status_code == 403


def test_customer_cannot_update_order_status(seeded_client, customer_token):
    """
    Padlock R-1:
    Customer must not be able to call admin order status endpoint.
    """
    add_first_item_to_cart(seeded_client, customer_token)
    order = place_order(seeded_client, customer_token)
    order_id = order.json()["id"]

    resp = seeded_client.put(
        f"/api/admin/orders/{order_id}/status",
        json={"status": "Confirmed"},
        headers=customer_token,
    )
    assert resp.status_code == 403


def test_unauthenticated_cannot_access_orders(seeded_client):
    """
    Padlock R-2:
    No JWT token → 401 on protected order routes.
    Gherkin: 'Scenario: Unauthenticated access to protected routes'
    """
    resp = seeded_client.get("/api/orders")
    assert resp.status_code == 401


def test_admin_invalid_status_returns_400(seeded_client, customer_token, admin_token):
    """
    Padlock R-3:
    Admin setting an invalid order status must return 400.
    Gherkin: 'Scenario: Admin updates order status to invalid value'
    """
    add_first_item_to_cart(seeded_client, customer_token)
    order = place_order(seeded_client, customer_token)
    order_id = order.json()["id"]

    resp = seeded_client.put(
        f"/api/admin/orders/{order_id}/status",
        json={"status": "InvalidStatus"},
        headers=admin_token,
    )
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Invalid order status"


def test_customer_cannot_see_another_customers_order(seeded_client, admin_token):
    """
    Padlock O-10:
    A customer must receive 404 (not 403) when accessing another user's order.
    Information hiding: existence of the order is not revealed.
    Gherkin: 'Scenario: View another customer's order'
    """
    import importlib
    # Register a second customer
    second = seeded_client.post("/api/auth/register", json={
        "full_name": "Omar Ali",
        "email": "omar@example.com",
        "password": "omarpass123",
    })
    second_headers = {"Authorization": f"Bearer {second.json()['access_token']}"}

    # Second customer places an order
    menu = seeded_client.get("/api/menu/items")
    item_id = menu.json()[0]["id"]
    seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 1},
        headers=second_headers,
    )
    order = seeded_client.post("/api/orders", json={
        "delivery_address": "456 Other St",
        "phone": "01111111111",
        "payment_method": "CashOnDelivery",
    }, headers=second_headers)
    other_order_id = order.json()["id"]

    # Original customer tries to access it
    customer_login = seeded_client.post("/api/auth/login", json={
        "email": "customer@example.com", "password": "customer123"
    })
    customer_headers = {"Authorization": f"Bearer {customer_login.json()['access_token']}"}

    resp = seeded_client.get(f"/api/orders/{other_order_id}", headers=customer_headers)
    assert resp.status_code == 404