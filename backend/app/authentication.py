import jwt
from dotenv import dotenv_values
from fastapi import status
from fastapi.exceptions import HTTPException

from .models import User

config_credentials = dotenv_values("../.env")


async def verify_token(token: str):
    try:
        payload = jwt.decode(token, config_credentials["SECRET"])
        user = await User.get(id=payload.get("id"))
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
