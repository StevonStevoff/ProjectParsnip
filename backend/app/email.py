from typing import List

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from pydantic import BaseModel, EmailStr

from app import settings

config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_EMAIL,
    MAIL_PORT=587,
    MAIL_SERVER="sandbox.smtp.mailtrap.io",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


class EmailSchema(BaseModel):
    email: List[EmailStr]


async def send_verification_email(email: List, token: str):
    # generate token
    """token_data = {
        "id": instance.id,
        "username": instance.username,
    }

    token = jwt.encode(token_data, config_credentials["SECRET"], algorithm="HS256")
    """

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
                     link below to verify your account.</p>

                    <a
                    href="http://localhost:8000/users/verification/?token={token}">
                    Verify your email
                    </a>

                    <p>Use full token to verify through the api: \n{token}"</p>

                    <br>

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


async def send_forgot_password_email(email: List, token: str):

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

                <p>Please click the link below to reset your password
                 at Project Parsnip.</p>

                <a
                href="http://localhost:8000/users/verification/?token={token}">
                Reset Password
                </a>

                <p>Use full token to reset through the api: \n{token}"</p>

                <br>

                <p>If you did not request to reset your password,
                 please ignore this email, thankyou.</p>

            </div>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Project Parsnip Forgot Password",
        recipients=email,  # list of email recipients (in our case only 1)
        body=template,
        subtype="html",
    )

    fm = FastMail(config)
    await fm.send_message(message=message)
