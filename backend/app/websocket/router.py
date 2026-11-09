from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.security import decode_access_token
from app.db.models import User, WorkflowExecution
from app.db.session import SessionLocal
from app.websocket.connection_manager import ws_manager

ws_router = APIRouter()

@ws_router.websocket("/ws/executions/{execution_id}")
async def execution_websocket_endpoint(websocket: WebSocket, execution_id: str):
    # Browsers cannot attach Authorization headers to native WebSocket handshakes.
    # Require a short-lived token in Sec-WebSocket-Protocol, never in the URL.
    offered = websocket.headers.get("sec-websocket-protocol", "").split(",")
    token = next((value.strip()[7:] for value in offered if value.strip().startswith("bearer.")), None)
    payload = decode_access_token(token) if token else None
    if not payload or not payload.get("sub"):
        await websocket.close(code=4401)
        return
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == payload["sub"], User.is_active.is_(True)).first()
        execution = db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id, WorkflowExecution.user_id == payload["sub"]).first()
        if not user or not execution:
            await websocket.close(code=4404)
            return
        if not await ws_manager.connect(websocket, execution_id):
            return
    finally:
        db.close()
    try:
        while True:
            # Keep connection alive & handle incoming pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
            else:
                await websocket.close(code=4400)
                break
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, execution_id)

