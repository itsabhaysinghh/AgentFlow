import uuid

import pytest
from cryptography.fernet import Fernet

from app.core import credentials
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.db.models import IntegrationAccount, User
from app.features.integrations.credentials import get_provider_credential


@pytest.fixture
def credential_key(monkeypatch):
    key = Fernet.generate_key().decode()
    monkeypatch.setattr(settings, "CREDENTIAL_ENCRYPTION_KEY", key)
    return key


def test_credential_round_trip_is_encrypted(credential_key):
    plaintext = "provider-token-for-test-only"

    encrypted = credentials.encrypt_credential(plaintext)

    assert encrypted != plaintext
    assert credentials.decrypt_credential(encrypted) == plaintext


@pytest.mark.parametrize("bad_key", ["", "not-a-fernet-key"])
def test_missing_or_invalid_encryption_key_is_rejected(monkeypatch, bad_key):
    monkeypatch.setattr(settings, "CREDENTIAL_ENCRYPTION_KEY", bad_key)

    with pytest.raises(RuntimeError, match="CREDENTIAL_ENCRYPTION_KEY"):
        credentials.encrypt_credential("test-value")


def test_invalid_ciphertext_is_rejected(credential_key):
    with pytest.raises(ValueError, match="cannot be decrypted"):
        credentials.decrypt_credential("not-a-valid-fernet-token")


def _user_and_headers(db_session, email_prefix):
    user = User(
        email=f"{email_prefix}-{uuid.uuid4().hex}@example.test",
        hashed_password=get_password_hash("test-password"),
        full_name=email_prefix,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user, {"Authorization": f"Bearer {create_access_token(user.id)}"}


def test_credentials_are_encrypted_isolated_and_never_returned(client, db_session, credential_key):
    first_user, first_headers = _user_and_headers(db_session, "first")
    second_user, second_headers = _user_and_headers(db_session, "second")
    first_secret = "first-provider-secret"
    second_secret = "second-provider-secret"

    first_response = client.put(
        "/api/v1/integrations/github/credentials",
        headers=first_headers,
        json={"credential": first_secret, "account_identifier": "first-account"},
    )
    second_response = client.put(
        "/api/v1/integrations/github/credentials",
        headers=second_headers,
        json={"credential": second_secret, "account_identifier": "second-account"},
    )

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    for response, secret in ((first_response, first_secret), (second_response, second_secret)):
        body = response.json()
        assert body["credential_configured"] is True
        assert "credential" not in body
        assert "encrypted_credentials" not in body
        assert secret not in response.text

    first_account = db_session.query(IntegrationAccount).filter_by(user_id=first_user.id, provider_key="github").one()
    second_account = db_session.query(IntegrationAccount).filter_by(user_id=second_user.id, provider_key="github").one()
    assert first_account.encrypted_credentials != first_secret
    assert second_account.encrypted_credentials != second_secret
    assert first_account.encrypted_credentials != second_account.encrypted_credentials
    assert get_provider_credential(db_session, first_user.id, "github") == first_secret
    assert get_provider_credential(db_session, second_user.id, "github") == second_secret

    status_response = client.get("/api/v1/integrations/github/credentials", headers=first_headers)
    assert status_response.status_code == 200
    assert first_secret not in status_response.text
    assert second_secret not in status_response.text
    assert status_response.json()["connected_account"] == "first-account"
