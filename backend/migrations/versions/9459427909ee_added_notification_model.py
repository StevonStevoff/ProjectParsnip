"""Added Notification Model

Revision ID: 9459427909ee
Revises: 6f1175ef1088
Create Date: 2023-04-06 14:19:59.588346

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "9459427909ee"
down_revision = "6f1175ef1088"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(), nullable=True),
        sa.Column("resolved", sa.Boolean(), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=True),
        sa.Column("plant_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["plant_id"],
            ["plants.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("notifications")
    # ### end Alembic commands ###