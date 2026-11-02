from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import IntegrationAccount, User
from app.features.authentication.routes import get_current_user

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
    linked = db.query(IntegrationAccount).filter(
        IntegrationAccount.user_id == current_user.id,
        IntegrationAccount.provider_key == key
    ).first()

    if not linked:
        meta = next((item for item in DEFAULT_INTEGRATIONS if item["key"] == key), None)
        if not meta:
            raise HTTPException(status_code=404, detail="Integration provider not supported")
        linked = IntegrationAccount(
            user_id=current_user.id,
            provider_key=key,
            name=meta["name"],
            status="connected",
            account_identifier=f"user@{key}.linked",
            permissions=meta["permissions"]
        )
        db.add(linked)
    else:
        linked.status = "disconnected" if linked.status == "connected" else "connected"

    db.commit()
    db.refresh(linked)
    return {"key": key, "status": linked.status}
