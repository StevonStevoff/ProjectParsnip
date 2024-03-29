"""Add token uuid

Revision ID: 2f980c1bf945
Revises: 0e2e991a419e
Create Date: 2023-04-21 10:39:45.580737

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "2f980c1bf945"
down_revision = "0e2e991a419e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("devices", sa.Column("token_uuid", sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("devices", "token_uuid")
    # ### end Alembic commands ###
