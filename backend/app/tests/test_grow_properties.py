import pytest
from sqlalchemy import or_, select

from app.models import GrowPropertyType
from app.tests.conftest import get_all_objects, get_objects
from app.tests.populate_tests import populate_db

