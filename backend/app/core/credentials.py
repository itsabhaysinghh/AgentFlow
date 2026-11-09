"""Authenticated encryption for provider credentials held only on the server."""
from cryptography.fernet import Fernet, InvalidToken
from app.core.config import settings

def _cipher() -> Fernet:
    key = getattr(settings, "CREDENTIAL_ENCRYPTION_KEY", "")
    if not key:
        raise RuntimeError("CREDENTIAL_ENCRYPTION_KEY is not configured.")
    try:
        return Fernet(key.encode())
    except (TypeError, ValueError) as error:
        # Do not include the invalid key in an error or log message.
        raise RuntimeError("CREDENTIAL_ENCRYPTION_KEY is invalid.") from error

def encrypt_credential(value: str) -> str:
    return _cipher().encrypt(value.encode()).decode()

def decrypt_credential(value: str) -> str:
    try:
        return _cipher().decrypt(value.encode()).decode()
    except InvalidToken as error:
        raise ValueError("Stored provider credential cannot be decrypted.") from error
