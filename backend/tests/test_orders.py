import importlib
import sys


def _reload_app_modules():
    for name in list(sys.modules):
        if name == "app" or name.startswith("app."):
            sys.modules.pop(name)


def test_customer_order_and_admin_status_flow(tmp_path, monkeypatch):
    db_path = tmp_path / "test_ordering.db"
    monkeypatch.setenv("COS_SKIP_DOTENV_OVERRIDE", "1")
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    _reload_app_modules()

    main = importlib.import_module("app.main")
    seed = importlib.import_module("app.seed")
    seed.seed_database()

    from fastapi.testclient import TestClient

    client = TestClient(main.app)

    customer_login = client.post(
        "/api/auth/login",
        json={"email": "customer@example.com", "password": "customer123"},
    )
    assert customer_login.status_code == 200
    customer_headers = {"Authorization": f"Bearer {customer_login.json()['access_token']}"}

    menu = client.get("/api/menu/items")
    assert menu.status_code == 200
    assert len(menu.json()) >= 15

    cart = client.post(
        "/api/cart/items",
        json={"menu_item_id": menu.json()[0]["id"], "quantity": 1},
        headers=customer_headers,
    )
    assert cart.status_code == 201

    order = client.post(
        "/api/orders",
        json={
            "delivery_address": "123 Main Street",
            "phone": "01000000000",
            "payment_method": "CashOnDelivery",
            "promo_code": "SAVE10",
        },
        headers=customer_headers,
    )
    assert order.status_code == 201

    admin_login = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
    )
    assert admin_login.status_code == 200
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    status_update = client.put(
        f"/api/admin/orders/{order.json()['id']}/status",
        json={"status": "Preparing"},
        headers=admin_headers,
    )
    assert status_update.status_code == 200
    assert status_update.json()["status"] == "Preparing"
