import os
from os.path import dirname, join

from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), "../.env")
load_dotenv(dotenv_path)

BACKEND_SECRET_KEY = os.environ.get("BACKEND_SECRET_KEY")
MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
MAIL_EMAIL = os.environ.get("MAIL_EMAIL")

print(f"Mail Username: {MAIL_USERNAME}")
print(f"Mail Password: {MAIL_PASSWORD}")
print(f"Mail Email: {MAIL_EMAIL}")
