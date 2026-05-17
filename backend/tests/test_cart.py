"""
tests/test_cart.py
==================
Boundary and failure-path tests for the Cart slice.
Maps to Phase 2 Gherkin scenarios 1.3.
All tests use the seeded_client + customer_token fixtures from conftest.py.
"""


# ══════════════════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════════════════

def first_menu_item_id(seeded_client):
    resp = seeded_client.get("/api/menu/items")
    assert resp.status_code == 200
    return resp.json()[0]["id"]


# ══════════════════════════════════════════════════════════════════════════════
# Cart — Happy Path
# ══════════════════════════════════════════════════════════════════════════════

def test_add_item_to_cart_returns_201(seeded_client, customer_token):
    """Padlock C-8: POST /api/cart/items must return 201 Created."""
    item_id = first_menu_item_id(seeded_client)
    resp = seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 1},
        headers=customer_token,
    )
    assert resp.status_code == 201


def test_get_cart_returns_200(seeded_client, customer_token):
    """GET /api/cart must return 200 for an authenticated customer."""
    resp = seeded_client.get("/api/cart", headers=customer_token)
    assert resp.status_code == 200


def test_clear_cart_returns_204(seeded_client, customer_token):
    """
    Padlock C-8 / Gherkin: 'Scenario: Clear entire cart'
    DELETE /api/cart returns 204 No Content — cart is cleared server-side.
    Verified by GET /api/cart after clear showing empty items list.
    """
    item_id = first_menu_item_id(seeded_client)
    seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 1},
        headers=customer_token,
    )
    # Clear the cart — returns 204 No Content (no response body)
    resp = seeded_client.delete("/api/cart", headers=customer_token)
    assert resp.status_code == 204

    # Confirm cart is empty via subsequent GET
    cart = seeded_client.get("/api/cart", headers=customer_token)
    assert cart.status_code == 200
    assert cart.json()["items"] == []


# ══════════════════════════════════════════════════════════════════════════════
# Cart — Failure Paths
# ══════════════════════════════════════════════════════════════════════════════

def test_add_item_zero_quantity_returns_400(seeded_client, customer_token):
    """
    Padlock C-1: quantity=0 must return 400 with exact detail message.
    Gherkin: 'Scenario: Add item with zero quantity'
    """
    item_id = first_menu_item_id(seeded_client)
    resp = seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 0},
        headers=customer_token,
    )
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Quantity must be greater than zero"


def test_add_item_exceeding_stock_returns_400(seeded_client, customer_token):
    """
    Padlock C-2: Requesting more units than available stock must return 400.
    Gherkin: 'Scenario: Add item exceeding stock'
    """
    item_id = first_menu_item_id(seeded_client)
    resp = seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 999999},
        headers=customer_token,
    )
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Not enough stock"


def test_add_nonexistent_item_returns_404(seeded_client, customer_token):
    """
    Padlock C-6: A menu_item_id that does not exist must return 404 Not Found.
    """
    resp = seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": 999999, "quantity": 1},
        headers=customer_token,
    )
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Menu item not found"


def test_add_item_accumulates_quantity(seeded_client, customer_token):
    """
    Padlock C-4: Adding the same item twice must accumulate quantity — no duplicate DB row.
    Gherkin: 'Scenario: Add same item twice (accumulates quantity)'
    """
    item_id = first_menu_item_id(seeded_client)
    seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 1},
        headers=customer_token,
    )
    resp = seeded_client.post(
        "/api/cart/items",
        json={"menu_item_id": item_id, "quantity": 2},
        headers=customer_token,
    )
    assert resp.status_code == 201
    items = resp.json()["items"]
    matching = [i for i in items if i["menu_item_id"] == item_id]
    assert len(matching) == 1, "Duplicate cart_item row created — accumulation failed"
    assert matching[0]["quantity"] == 3


def test_cart_requires_authentication(seeded_client):
    """
    Padlock R-2: Cart endpoints must return 401 when no JWT is provided.
    Gherkin: 'Scenario: Unauthenticated access to protected routes'
    """
    resp = seeded_client.get("/api/cart")
    assert resp.status_code == 401