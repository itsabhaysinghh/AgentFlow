from app.orchestration.state import AgentFlowState

def route_after_validation(state: AgentFlowState) -> str:
    """Conditional edge from validator"""
    if not state.get("is_valid", False):
        if state.get("retry_count", 0) < 1:
            return "retry_research"
        return "reporter"
    return "reporter"

