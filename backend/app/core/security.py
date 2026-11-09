import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from app.core.config import settings

password_hasher = PasswordHasher()

def get_password_hash(password: str) -> str:
    """Hash a password using Argon2id with a unique, library-generated salt."""
    return password_hasher.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify Argon2id hashes and retain temporary support for legacy SHA-256 rows."""
    try:
        if hashed_password.startswith("$argon2"):
            return password_hasher.verify(hashed_password, plain_password)
        salt, stored_hash = hashed_password.split("$", 1)
        candidate = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
        return hmac.compare_digest(candidate, stored_hash)
    except (InvalidHashError, VerificationError, VerifyMismatchError, ValueError):
        return False

def password_needs_rehash(hashed_password: str) -> bool:
    return not hashed_password.startswith("$argon2") or password_hasher.check_needs_rehash(hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """Generate JWT access token"""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode and validate JWT access token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

