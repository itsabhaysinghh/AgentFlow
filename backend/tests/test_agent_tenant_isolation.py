from app.db.models import Agent, AgentExecution
from app.features.agents import routes as agent_routes

def _user(client, email):
    response = client.post('/api/v1/auth/register', json={'email': email, 'password': 'TenantPassword123!', 'full_name': email})
    return response.json()['access_token']

def _headers(token): return {'Authorization': f'Bearer {token}'}

def test_agents_are_tenant_scoped(client, db_session, monkeypatch):
    token_a = _user(client, 'a@example.test')
    token_b = _user(client, 'b@example.test')
    agent_a = client.post('/api/v1/agents', headers=_headers(token_a), json={'name':'Agent A','description':'a','system_prompt':'a'}).json()
    agent_b = client.post('/api/v1/agents', headers=_headers(token_b), json={'name':'Agent B','description':'b','system_prompt':'b'}).json()
    legacy = Agent(role='legacy', name='Legacy', description='legacy', system_prompt='legacy')
    db_session.add(legacy); db_session.commit()
    listed = client.get('/api/v1/agents', headers=_headers(token_a)).json()
    assert {item['id'] for item in listed} == {agent_a['id']}
    assert client.get('/api/v1/agents/custom-agent-b', headers=_headers(token_a)).status_code == 404
    assert client.put('/api/v1/agents/custom-agent-b', headers=_headers(token_a), json={'system_prompt':'takeover','temperature':0.1}).status_code == 404
    assert client.delete(f"/api/v1/agents/{agent_b['id']}", headers=_headers(token_a)).status_code == 404
    assert client.get('/api/v1/agents/legacy', headers=_headers(token_a)).status_code == 404
    assert client.post(f"/api/v1/agents/{legacy.id}/execute", headers=_headers(token_a), json={'prompt':'x'}).status_code == 404
    monkeypatch.setattr(agent_routes, 'generate', lambda **_: {'output':'real-test-output','duration_seconds':0.1,'input_tokens':2,'output_tokens':3})
    assert client.post(f"/api/v1/agents/{agent_a['id']}/execute", headers=_headers(token_a), json={'prompt':'hello'}).status_code == 200
    assert client.post(f"/api/v1/agents/{agent_b['id']}/execute", headers=_headers(token_a), json={'prompt':'hello'}).status_code == 404
    assert client.get(f"/api/v1/agents/{agent_b['id']}/executions", headers=_headers(token_a)).status_code == 404
    assert client.get('/api/v1/agents').status_code == 401
    assert client.get('/api/v1/agents', headers={'Authorization':'Bearer bad'}).status_code == 401
    assert client.get('/api/v1/agents', headers=_headers(token_b)).status_code == 200

