"""Require one provider credential record per user.

Revision ID: 4ee4a2d671ab
Revises: fdb19e66a9e1
"""
from alembic import op


revision = "4ee4a2d671ab"
down_revision = "fdb19e66a9e1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("integration_accounts") as batch_op:
        batch_op.create_unique_constraint(
            "uq_integration_accounts_user_provider", ["user_id", "provider_key"]
        )


def downgrade() -> None:
    with op.batch_alter_table("integration_accounts") as batch_op:
        batch_op.drop_constraint("uq_integration_accounts_user_provider", type_="unique")
