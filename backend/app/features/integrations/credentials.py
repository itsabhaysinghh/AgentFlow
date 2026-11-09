"""Server-only access to encrypted provider credentials."""
from sqlalchemy.orm import Session

from app.core.credentials import decrypt_credential
from app.db.models import IntegrationAccount


def get_provider_credential(db: Session, user_id: str, provider_key: str) -> str | None:
    """Return one user's credential for server-side provider calls only.

    This module deliberately has no API serialization helpers.  Callers must not
    return its result in an HTTP response, log it, or put it in a task payload.
    """
    account = (
        db.query(IntegrationAccount)
        .filter(
            IntegrationAccount.user_id == user_id,
            IntegrationAccount.provider_key == provider_key,
            IntegrationAccount.status == "connected",
        )
        .one_or_none()
    )
    if not account or not account.encrypted_credentials:
        return None
    return decrypt_credential(account.encrypted_credentials)
