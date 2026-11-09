from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.credentials import encrypt_credential
from app.db.session import get_db
from app.db.models import IntegrationAccount, User
from app.features.authentication.routes import get_current_user
from app.features.integrations.schemas import CredentialUpsert, IntegrationCredentialStatus

integrations_router = APIRouter(prefix="/integrations", tags=["Integrations"])

DEFAULT_INTEGRATIONS = [
    {
        "key": "github",
        "name": "GitHub",
        "category": "code",
        "description": "Inspect repositories, pull requests, automated code audits, and PR review comments.",
        "permissions": ["repo:read", "pull_requests:write", "issues:write"]
    },
    {
        "key": "gmail",
        "name": "Gmail",
        "category": "communication",
        "description": "Draft, format, and dispatch executive reports and workflow completion alerts via Google Workspace.",
        "permissions": ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.readonly"]
    },
    {
        "key": "telegram",
        "name": "Telegram",
        "category": "messaging",
        "description": "Send high-priority notifications, workflow status alerts, and human approval prompts directly to Telegram bots.",
        "permissions": ["send_messages", "inline_keyboard_callbacks"]
    },
    {
        "key": "gcalendar",
        "name": "Google Calendar",
        "category": "productivity",
        "description": "Schedule automated recurring runs and synchronize workflow execution timelines with your team calendar.",
        "permissions": ["calendar.events.readonly", "calendar.events.write"]
    },
    {
        "key": "gdrive",
        "name": "Google Drive",
        "category": "productivity",
        "description": "Automatically export generated reports, analysis dossiers, and raw data dumps to Google Drive folders.",
        "permissions": ["drive.file", "drive.readonly"]
    },
    {
        "key": "whatsapp",
        "name": "WhatsApp",
        "category": "messaging",
        "description": "Enterprise WhatsApp Business Cloud API integration for urgent human-in-the-loop approval escalation.",
        "permissions": ["messages:write", "templates:read"]
    }
]


def _provider_metadata(key: str) -> dict:
    meta = next((item for item in DEFAULT_INTEGRATIONS if item["key"] == key), None)
    if not meta:
        raise HTTPException(status_code=404, detail="Integration provider not supported")
    return meta


def _safe_credential_status(account: IntegrationAccount) -> IntegrationCredentialStatus:
    """The encrypted database field is intentionally never part of an API model."""
    return IntegrationCredentialStatus(
        key=account.provider_key,
        status=account.status,
        connected_account=account.account_identifier,
        credential_configured=bool(account.encrypted_credentials),
    )

@integrations_router.get("")
def list_integrations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_integrations = {i.provider_key: i for i in db.query(IntegrationAccount).filter(IntegrationAccount.user_id == current_user.id).all()}

    results = []
    for default_item in DEFAULT_INTEGRATIONS:
        key = default_item["key"]
        linked = user_integrations.get(key)
        results.append({
            "id": linked.id if linked else f"int-{key}",
            "key": key,
            "name": default_item["name"],
            "description": default_item["description"],
            "category": default_item["category"],
            "status": linked.status if linked else "disconnected",
            "connected_account": linked.account_identifier if linked else None,
            "permissions": default_item["permissions"]
        })
    return results

@integrations_router.post("/{key}/toggle")
def toggle_integration(key: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _provider_metadata(key)
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Use credential validation to connect an integration; connection cannot be toggled.")


@integrations_router.put("/{key}/credentials", response_model=IntegrationCredentialStatus)
def save_provider_credential(
    key: str,
    credential_in: CredentialUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Encrypt and save a provider credential for the authenticated user only."""
    meta = _provider_metadata(key)
    account = (
        db.query(IntegrationAccount)
        .filter(IntegrationAccount.user_id == current_user.id, IntegrationAccount.provider_key == key)
        .one_or_none()
    )
    encrypted = encrypt_credential(credential_in.credential)
    if account:
        account.encrypted_credentials = encrypted
        account.status = "connected"
        if credential_in.account_identifier is not None:
            account.account_identifier = credential_in.account_identifier
    else:
        account = IntegrationAccount(
            user_id=current_user.id,
            provider_key=key,
            name=meta["name"],
            status="connected",
            account_identifier=credential_in.account_identifier,
            encrypted_credentials=encrypted,
            permissions=meta["permissions"],
        )
        db.add(account)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Credential update conflicted; retry the request")
    db.refresh(account)
    return _safe_credential_status(account)


@integrations_router.get("/{key}/credentials", response_model=IntegrationCredentialStatus)
def get_provider_credential_status(
    key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _provider_metadata(key)
    account = (
        db.query(IntegrationAccount)
        .filter(IntegrationAccount.user_id == current_user.id, IntegrationAccount.provider_key == key)
        .one_or_none()
    )
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No credential configured for this provider")
    return _safe_credential_status(account)

@integrations_router.delete("/{key}/credentials", status_code=status.HTTP_204_NO_CONTENT)
def delete_provider_credential(key: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _provider_metadata(key)
    account = db.query(IntegrationAccount).filter(IntegrationAccount.user_id == current_user.id, IntegrationAccount.provider_key == key).one_or_none()
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No credential configured for this provider")
    db.delete(account)
    db.commit()
    return None

