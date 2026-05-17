"""
tests/test_auth.py
==================
Failure-path and boundary tests for the Authentication slice.
Maps to Phase 2 Gherkin scenarios 1.1 and 1.2.
"""


# ── Helpers ───────────────────────────────────────────────────────────────────

VALID_PAYLOAD = {
    "full_name": "Sarah Ahmed",
    "email": "sarah@example.com",
    "password": "password123",
    "phone": "01000000000",
    "address": "123 Main Street",
}


# ══════════════════════════════════════════════════════════════════════════════
# Registration — Happy Path
# ══════════════════════════════════════════════════════════════════════════════

def test_register_returns_201(client):
    """Padlock A-1: Registration must return 201 Created, not 200 OK."""
    resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
    assert resp.status_code == 201


def test_register_default_role_is_customer(client):
    """Padlock A-2: Newly registered user must default to role='customer'."""
    resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
    assert resp.json()["user"]["role"] == "customer"


def test_register_response_excludes_password(client):
    """Padlock A-5: password_hash must NEVER appear in any API response."""
    resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
    body = resp.json()
    assert "password" not in body
    assert "password_hash" not in body
    assert "password" not in body.get("user", {})
    assert "password_hash" not in body.get("user", {})


def test_register_returns_bearer_token(client):
    """Padlock A-8: token_type must be exactly the string 'bearer'."""
    resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
    assert resp.json()["token_type"] == "bearer"
    assert "access_token" in resp.json()


# ══════════════════════════════════════════════════════════════════════════════
# Registration — Failure Paths  (Gap G-1)
# ══════════════════════════════════════════════════════════════════════════════

def test_register_duplicate_email_returns_409(client):
    """
    Padlock A-3 / Gap G-1:
    Registering twice with the same email must return 409 Conflict.
    Gherkin: 'Scenario: Registration with duplicate email'
    """
    client.post("/api/auth/register", json=VALID_PAYLOAD)
    resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
    assert resp.status_code == 409
    assert resp.json()["detail"] == "Email is already registered"


def test_register_missing_password_returns_422(client):
    """
    Padlock A-4: Missing required field must return 422 Unprocessable Entity.
    Gherkin: 'Scenario: Registration with missing required fields'
    """
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "password"}
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 422


def test_register_invalid_email_format_returns_422(client):
    """
    Padlock A-4: Pydantic EmailStr must reject malformed email addresses.
    Gherkin: 'Scenario: Registration with invalid email format'
    """
    payload = {**VALID_PAYLOAD, "email": "not-an-email"}
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 422


# ══════════════════════════════════════════════════════════════════════════════
# Login — Failure Paths  (Gap G-2)
# ══════════════════════════════════════════════════════════════════════════════

def test_login_wrong_password_returns_401(client):
    """
    Padlock A-6 / Gap G-2:
    Login with a wrong password must return 401 with an ambiguous message
    (no distinction between 'user not found' and 'wrong password').
    Gherkin: 'Scenario: Login with incorrect password'
    """
    client.post("/api/auth/register", json=VALID_PAYLOAD)
    resp = client.post(
        "/api/auth/login",
        json={"email": "sarah@example.com", "password": "WRONGPASSWORD"},
    )
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid email or password"


def test_login_nonexistent_email_returns_401(client):
    """
    Padlock A-6: Non-existent email must return 401, same message as wrong password.
    Gherkin: 'Scenario: Login with non-existent email'
    """
    resp = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "anything"},
    )
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid email or password"


def test_login_no_token_returned_on_failure(client):
    """
    Padlock A-6: No access_token should be present when login fails.
    """
    resp = client.post(
        "/api/auth/login",
        json={"email": "sarah@example.com", "password": "wrong"},
    )
    assert resp.status_code == 401
    assert "access_token" not in resp.json()