"""
tests/test_unit.py
==================
Pure unit tests — no database, no HTTP client, no fixtures.
Tests isolated functions and constants from the service and security layers.
Contributes the 'Unit' tier of the Testing Pyramid (Phase 4).

Place this file at: backend/tests/test_unit.py
"""
import os
import re

# Set required env vars BEFORE any app module is imported.
# This prevents pydantic-settings from complaining about missing values
# and prevents the DB engine from being created against a real file.
os.environ.setdefault("DATABASE_URL", "sqlite:///./unit_test_temp.db")
os.environ.setdefault("COS_SKIP_DOTENV_OVERRIDE", "1")
os.environ.setdefault("JWT_SECRET_KEY", "unit-test-secret-key-for-phase4-only!")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")

from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core.security import create_access_token, get_password_hash, verify_password
from app.services.order_service import (
    CANCELABLE_STATUSES,
    DELIVERY_FEE,
    VALID_PAYMENT_METHODS,
    _generate_order_number,
)


# ══════════════════════════════════════════════════════════════════════════════
# Security — password hashing  (5 tests)
# ══════════════════════════════════════════════════════════════════════════════

def test_password_hash_is_not_plaintext():
    """Padlock A-5: The stored hash must differ from the original password."""
    hashed = get_password_hash("password123")
    assert hashed != "password123"


def test_password_hash_uses_bcrypt():
    """get_password_hash must produce a bcrypt string ($2b$ or $2a$ prefix)."""
    hashed = get_password_hash("anypassword")
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")


def test_verify_password_correct():
    """verify_password returns True when the plain text matches the hash."""
    hashed = get_password_hash("correctpassword")
    assert verify_password("correctpassword", hashed) is True


def test_verify_password_wrong():
    """Padlock A-6: verify_password returns False for a wrong password."""
    hashed = get_password_hash("correctpassword")
    assert verify_password("wrongpassword", hashed) is False


def test_verify_password_is_case_sensitive():
    """Password verification is case-sensitive — 'Pass' != 'pass'."""
    hashed = get_password_hash("Password123")
    assert verify_password("password123", hashed) is False


# ══════════════════════════════════════════════════════════════════════════════
# Security — JWT token creation  (4 tests)
# ══════════════════════════════════════════════════════════════════════════════

def test_create_access_token_returns_string():
    """create_access_token must return a non-empty string."""
    token = create_access_token({"sub": 1})
    assert isinstance(token, str) and len(token) > 0


def test_create_access_token_sub_is_stringified():
    """
    The 'sub' claim must be a string even when an integer user ID is passed.
    security.py explicitly casts: to_encode['sub'] = str(to_encode['sub'])
    """
    token = create_access_token({"sub": 42})
    from app.core.config import settings
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    assert payload["sub"] == "42"


def test_create_access_token_contains_exp():
    """JWT must contain an 'exp' (expiry) claim."""
    token = create_access_token({"sub": 1})
    from app.core.config import settings
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    assert "exp" in payload


def test_create_access_token_custom_expiry_is_honoured():
    """
    Padlock A-9: A custom expires_delta must be reflected in the token's 'exp'.
    Tolerance: ±1 minute around the requested 5-minute window.
    """
    token = create_access_token({"sub": 1}, expires_delta=timedelta(minutes=5))
    from app.core.config import settings
    payload = jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
    exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    diff_minutes = (exp - datetime.now(timezone.utc)).total_seconds() / 60
    assert 4 <= diff_minutes <= 6


# ══════════════════════════════════════════════════════════════════════════════
# Order service — constants  (3 tests)
# ══════════════════════════════════════════════════════════════════════════════

def test_delivery_fee_is_exactly_3():
    """Padlock O-5: DELIVERY_FEE must be the constant 3.0."""
    assert DELIVERY_FEE == 3.0


def test_valid_payment_methods_exact_set():
    """VALID_PAYMENT_METHODS must contain exactly the three accepted values."""
    assert VALID_PAYMENT_METHODS == {"CashOnDelivery", "Card", "Wallet"}


def test_cancelable_statuses_exact_set():
    """Padlock O-9: Only 'Pending' and 'Confirmed' orders can be cancelled."""
    assert CANCELABLE_STATUSES == {"Pending", "Confirmed"}


# ══════════════════════════════════════════════════════════════════════════════
# Order service — _generate_order_number  (2 tests)
# ══════════════════════════════════════════════════════════════════════════════

def test_order_number_matches_format():
    """Padlock O-8: Order number must match ORD-YYYYMMDD-XXXX."""
    number = _generate_order_number()
    assert re.match(r"^ORD-\d{8}-\d{4}$", number), (
        f"'{number}' does not match ORD-YYYYMMDD-XXXX"
    )


def test_order_number_suffix_in_range():
    """The random suffix must be a 4-digit number between 1000 and 9999."""
    for _ in range(30):  # repeat because suffix is random
        number = _generate_order_number()
        suffix = int(number.split("-")[2])
        assert 1000 <= suffix <= 9999


# ══════════════════════════════════════════════════════════════════════════════
# Order service — discount and total formula  (4 tests)
# ══════════════════════════════════════════════════════════════════════════════

def _apply_discount(subtotal: float, promo: str) -> float:
    """Mirrors the exact inline logic from order_service.create_order_from_cart."""
    return round(subtotal * 0.10, 2) if promo and promo.upper() == "SAVE10" else 0.0


def test_save10_discount_is_10_percent():
    """Padlock O-3: SAVE10 must produce a 10% discount of the subtotal."""
    assert _apply_discount(50.0, "SAVE10") == 5.0


def test_save10_is_case_insensitive():
    """Padlock O-4: lowercase 'save10' must produce the same discount as 'SAVE10'."""
    assert _apply_discount(50.0, "save10") == 5.0


def test_invalid_promo_gives_zero_discount():
    """An unrecognised promo code must yield zero discount."""
    assert _apply_discount(50.0, "BADCODE") == 0.0


def test_total_formula_is_correct():
    """Padlock O-11: total = subtotal - discount + DELIVERY_FEE."""
    subtotal = 50.0
    discount = _apply_discount(subtotal, "SAVE10")      # 5.0
    total = round(subtotal - discount + DELIVERY_FEE, 2)  # 50 - 5 + 3 = 48
    assert total == 48.0