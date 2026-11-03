import logging
from langgraph.graph import StateGraph, START, END
from app.orchestration.state import AgentFlowState
from app.orchestration.nodes import (
    planner_node,
    researcher_node,
    analyst_node,
    validator_node,
    reporter_node
)
from app.orchestration.routing import route_after_validation

logger = logging.getLogger("agentflow.orchestration.graph")

def create_agentflow_graph():
    """Constructs the compiled LangGraph execution graph"""
    workflow = StateGraph(AgentFlowState)

    # Register nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("analyst", analyst_node)
    workflow.add_node("validator", validator_node)
    workflow.add_node("reporter", reporter_node)

    # Build graph edges
    workflow.add_edge(START, "planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", "analyst")
    workflow.add_edge("analyst", "validator")

    # Conditional routing after validation
    workflow.add_conditional_edges(
        "validator",
        route_after_validation,
        {
            "retry_research": "researcher",
            "reporter": "reporter"
        }
    )

    workflow.add_edge("reporter", END)

    app = workflow.compile()
    return app

# Singleton compiled graph
agentflow_graph = create_agentflow_graph()

