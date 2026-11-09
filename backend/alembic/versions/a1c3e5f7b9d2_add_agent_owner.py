"""Add tenant ownership to agents.

Existing global agents remain unowned and inaccessible to ordinary users until an
operator assigns or retires them; the migration intentionally does not guess an owner.
"""
from alembic import op
import sqlalchemy as sa

revision = "a1c3e5f7b9d2"
down_revision = "4ee4a2d671ab"
branch_labels = None
depends_on = None

def upgrade() -> None:
    with op.batch_alter_table("agents") as batch_op:
        batch_op.add_column(sa.Column("user_id", sa.String(length=36), nullable=True))
        batch_op.create_foreign_key("fk_agents_user_id_users", "users", ["user_id"], ["id"])
        batch_op.create_index("ix_agents_user_id", ["user_id"])

    op.create_table(
        "agent_executions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("agent_id", sa.String(length=36), sa.ForeignKey("agents.id"), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False), sa.Column("output", sa.Text()),
        sa.Column("status", sa.String(length=30), nullable=False), sa.Column("model_name", sa.String(length=100), nullable=False),
        sa.Column("duration_seconds", sa.Float()), sa.Column("input_tokens", sa.Integer()), sa.Column("output_tokens", sa.Integer()),
        sa.Column("error_message", sa.Text()), sa.Column("created_at", sa.DateTime()),
    )
    op.create_index("ix_agent_executions_user_id", "agent_executions", ["user_id"])
    op.create_index("ix_agent_executions_agent_id", "agent_executions", ["agent_id"])

def downgrade() -> None:
    op.drop_index("ix_agent_executions_agent_id", table_name="agent_executions")
    op.drop_index("ix_agent_executions_user_id", table_name="agent_executions")
    op.drop_table("agent_executions")
    with op.batch_alter_table("agents") as batch_op:
        batch_op.drop_index("ix_agents_user_id")
        batch_op.drop_constraint("fk_agents_user_id_users", type_="foreignkey")
        batch_op.drop_column("user_id")
