import importlib
import sys
import pytest


def _reload_app_modules():
    """Force a clean re-import of the entire app package."""
    for name in list(sys.modules):
        if name == "app" or name.startswith("app."):
            sys.modules.pop(name)


@pytest.fixture()
def client(tmp_path, monkeypatch):
    """
    Provide a fully isolated FastAPI TestClient backed by a fresh SQLite DB.
    Each test that uses this fixture gets its own database file — zero shared state.
    """
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("COS_SKIP_DOTENV_OVERRIDE", "1")
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    _reload_app_modules()

    main = importlib.import_module("app.main")
    from fastapi.testclient import TestClient

    with TestClient(main.app) as c:
        yield c


@pytest.fixture()
def seeded_client(tmp_path, monkeypatch):
    """
    Like `client` but also runs seed_database() so admin, customer,
    and all 15+ menu items are available inside the test.
    """
    db_path = tmp_path / "test_seeded.db"
    monkeypatch.setenv("COS_SKIP_DOTENV_OVERRIDE", "1")
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    _reload_app_modules()

    main = importlib.import_module("app.main")
    seed = importlib.import_module("app.seed")
    seed.seed_database()

    from fastapi.testclient import TestClient

    with TestClient(main.app) as c:
        yield c


@pytest.fixture()
def customer_token(seeded_client):
    """Return a Bearer auth header for the seeded customer account."""
    resp = seeded_client.post(
        "/api/auth/login",
        json={"email": "customer@example.com", "password": "customer123"},
    )
    assert resp.status_code == 200
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


@pytest.fixture()
def admin_token(seeded_client):
    """Return a Bearer auth header for the seeded admin account."""
    resp = seeded_client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
    )
    assert resp.status_code == 200
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}