import pytest
from starlette.websockets import WebSocketDisconnect
from app.db.models import Workflow, WorkflowExecution
from app.websocket import router as ws_router

def _token(client, email):
    response = client.post('/api/v1/auth/register', json={'email':email,'password':'WebsocketPass123!','full_name':email})
    return response.json()['access_token'], response.json()['user_id']

def test_execution_websocket_requires_owner(client, db_session, monkeypatch):
    token_a, user_a = _token(client, 'ws-a@example.test')
    token_b, user_b = _token(client, 'ws-b@example.test')
    workflow_b = Workflow(user_id=user_b, title='B', prompt_template='x')
    db_session.add(workflow_b); db_session.commit()
    execution = WorkflowExecution(user_id=user_b, workflow_id=workflow_b.id, prompt='x')
    db_session.add(execution); db_session.commit()
    monkeypatch.setattr(ws_router, 'SessionLocal', lambda: db_session)
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect(f'/ws/executions/{execution.id}'):
            pass
    headers = {'sec-websocket-protocol': f'agentflow, bearer.{token_a}'}
    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect(f'/ws/executions/{execution.id}', headers=headers):
            pass
    workflow_a = Workflow(user_id=user_a, title='A', prompt_template='x')
    db_session.add(workflow_a); db_session.commit()
    own = WorkflowExecution(user_id=user_a, workflow_id=workflow_a.id, prompt='x')
    db_session.add(own); db_session.commit()
    headers = {'sec-websocket-protocol': f'agentflow, bearer.{token_a}'}
    with client.websocket_connect(f'/ws/executions/{own.id}', headers=headers) as socket:
        socket.send_text('ping')
        assert socket.receive_text() == 'pong'
