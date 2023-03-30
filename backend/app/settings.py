import os
from os.path import dirname, join
from pathlib import Path

from dotenv import load_dotenv

dotenv_path = join(Path(dirname(__file__), "../../.env"))
load_dotenv(dotenv_path)

BACKEND_SECRET_KEY = os.environ.get("BACKEND_SECRET_KEY")
