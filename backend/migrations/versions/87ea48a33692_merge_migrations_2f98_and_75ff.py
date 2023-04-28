"""merge migrations 2f98 and 75ff

Revision ID: 87ea48a33692
Revises: 2f980c1bf945, 75ffadd57328
Create Date: 2023-04-25 15:19:58.709586

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "87ea48a33692"
down_revision = ("2f980c1bf945", "75ffadd57328")
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
