import json
import logging
from typing import Dict, List
from fastapi import WebSocket

logger = logging.getLogger("agentflow.websocket")

class ConnectionManager:
    def __init__(self):
        # Maps execution_id to list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, execution_id: str):
        await websocket.accept()
        if execution_id not in self.active_connections:
            self.active_connections[execution_id] = []
        self.active_connections[execution_id].append(websocket)
        logger.info(f"WebSocket client connected to telemetry for execution {execution_id}")

    def disconnect(self, websocket: WebSocket, execution_id: str):
        if execution_id in self.active_connections:
            if websocket in self.active_connections[execution_id]:
                self.active_connections[execution_id].remove(websocket)
            if not self.active_connections[execution_id]:
                del self.active_connections[execution_id]
        logger.info(f"WebSocket client disconnected from telemetry for execution {execution_id}")

    async def broadcast_execution_event(self, execution_id: str, event_type: str, data: dict):
        if execution_id in self.active_connections:
            payload = json.dumps({
                "type": event_type,
                "executionId": execution_id,
                "data": data
            })
            for connection in self.active_connections[execution_id]:
                try:
                    await connection.send_text(payload)
                except Exception as e:
                    logger.warning(f"Failed to send WS message: {e}")

ws_manager = ConnectionManager()
