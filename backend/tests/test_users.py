import importlib
import sys


def _reload_app_modules():
    for name in list(sys.modules):
        if name == "app" or name.startswith("app."):
            sys.modules.pop(name)


def test_register_and_login_user(tmp_path, monkeypatch):
    db_path = tmp_path / "test_users.db"
    monkeypatch.setenv("COS_SKIP_DOTENV_OVERRIDE", "1")
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    _reload_app_modules()

    main = importlib.import_module("app.main")

    from fastapi.testclient import TestClient

    client = TestClient(main.app)

    register = client.post(
        "/api/auth/register",
        json={
            "full_name": "Sarah Ahmed",
            "email": "sarah@example.com",
            "password": "password123",
            "phone": "01000000000",
            "address": "123 Main Street",
        },
    )
    assert register.status_code == 201
    assert register.json()["user"]["role"] == "customer"

    login = client.post(
        "/api/auth/login",
        json={"email": "sarah@example.com", "password": "password123"},
    )
    assert login.status_code == 200
    assert login.json()["token_type"] == "bearer"
