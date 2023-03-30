from typing import List

import jwt
from dotenv import dotenv_values

"""from fastapi import (
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)"""
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from pydantic import BaseModel, EmailStr

from app.models import User

config_credentials = dotenv_values("../.env")

config = ConnectionConfig(
    MAIL_USERNAME=config_credentials["USERNAME"],
    MAIL_PASSWORD=config_credentials["PASSWORD"],
    MAIL_FROM=config_credentials["EMAIL"],
    MAIL_PORT=587,
    MAIL_SERVER="sandbox.smtp.mailtrap.io",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
)


class EmailSchema(BaseModel):
    email: List[EmailStr]


async def send_email(email: List, instance: User):
    token_data = {
        "id": instance.id,
        "username": instance.username,
    }

    token = jwt.encode(token_data, config_credentials["SECRET"])

    template = f"""
        <!DOCTYPE html>
        <html>
            <head>
            </head>
            <body>
                <div style="display: flex; align-items: center;
                justify-content:center; flex-direction: column">

                    <h3>Project Parsnip Account Verification</h3>
                    <br>

                    <p>Thanks for signing up to Project Parsnip, please click the
                     link provided to verify your account.</p>

                    <a style="margin-top: 1rem; padding: 1rem; border-radius: 0.5rem;
                    font-size: 1rem; text-decoration: none;
                    background: #0275d8; color: white;"
                    href="http://localhost:8000/users/verification/?token={token}">
                    Verify your email
                    </a>

                    <p>Please ignore this email if you did not create an account
                     with Project Parsnip, thankyou.</p>

                </div>
            </body>
        </html>
    """

    message = MessageSchema(
        subject="Project Parsnip Account Verification",
        recipients=email,  # list of email recipients (in our case only 1)
        body=template,
        subtype="html",
    )

    fm = FastMail(config)
    await fm.send_message(message=message)
