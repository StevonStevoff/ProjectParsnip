from typing import Annotated

import jwt
from dotenv import dotenv_values
from fastapi import Header, status
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

import app.settings as secrets
from app.models import User, Device


async def create_device_token(device: Device) -> str:
    payload = {"id": device.id}
    return jwt.encode(payload, secrets.BACKEND_SECRET_KEY, "HS256")


async def verify_device_token(device_token: Annotated[str, Header()]) -> bool:
    pass


async def verify_token(token: str, session: AsyncSession) -> User:
    try:
        payload = jwt.decode(token, secrets.BACKEND_SECRET_KEY, algorithms=["HS256"])
        user = await session.get(User, payload.get("id"))
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
