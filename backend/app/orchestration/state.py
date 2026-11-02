from typing import TypedDict, List, Dict, Any, Optional

class AgentFlowState(TypedDict):
    execution_id: str
    workflow_id: str
    task_prompt: str
    plan: List[Dict[str, Any]]
    research_data: Dict[str, Any]
    analysis_metrics: Dict[str, Any]
    validation_results: Dict[str, Any]
    final_report: str
    approval_required: bool
    approval_details: Optional[Dict[str, Any]]
    is_valid: bool
    retry_count: int
    errors: List[str]
    current_agent: str
