from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.connection_manager import ws_manager

ws_router = APIRouter()

@ws_router.websocket("/ws/executions/{execution_id}")
async def execution_websocket_endpoint(websocket: WebSocket, execution_id: str):
    await ws_manager.connect(websocket, execution_id)
    try:
        while True:
            # Keep connection alive & handle incoming pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, execution_id)

