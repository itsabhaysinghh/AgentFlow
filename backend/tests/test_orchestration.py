from app.orchestration.graph import agentflow_graph

def test_langgraph_pipeline_execution():
    initial_state = {
        "execution_id": "test-exec-101",
        "workflow_id": "test-wf-101",
        "task_prompt": "Research top five cloud computing companies in India and generate a report.",
        "plan": [],
        "research_data": {},
        "analysis_metrics": {},
        "validation_results": {},
        "final_report": "",
        "approval_required": False,
        "approval_details": None,
        "is_valid": True,
        "retry_count": 0,
        "errors": [],
        "current_agent": "planner"
    }

    final_state = agentflow_graph.invoke(initial_state)

    assert final_state["current_agent"] == "reporter"
    assert len(final_state["plan"]) > 0
    assert "entities_identified" in final_state["research_data"]
    assert "cost_efficiency_index" in final_state["analysis_metrics"]
    assert final_state["validation_results"]["passed"] is True
    assert "# Executive Intelligence Dossier" in final_state["final_report"]

