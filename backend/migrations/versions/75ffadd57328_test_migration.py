"""Test Migration

Revision ID: 75ffadd57328
Revises: fc23c5096b5e
Create Date: 2023-04-24 14:57:24.358810

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "75ffadd57328"
down_revision = "fc23c5096b5e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("users", sa.Column("push_token", sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "push_token")
    # ### end Alembic commands ###