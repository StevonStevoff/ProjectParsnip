import uuid
from typing import Annotated, Tuple

import jwt
from fastapi import Header, status
from fastapi.exceptions import HTTPException
from fastapi.security import APIKeyHeader
from sqlalchemy.ext.asyncio import AsyncSession

import app.settings as secrets
from app.models import Device, User
from app.router.utils import get_object_or_404

device_auth_header = APIKeyHeader(name="X-SECRET-DEVICE", scheme_name="device-header")


async def create_device_token(id: int) -> Tuple[str, str]:
    token_uuid = str(uuid.uuid4().hex)
    payload = {"device_id": id, "token_uuid": token_uuid}
    device_token = jwt.encode(payload, secrets.BACKEND_SECRET_KEY, "HS256")
    return device_token, token_uuid


async def verify_device_token(
    device_token: Annotated[str, Header()], session: AsyncSession
):
    try:
        payload = jwt.decode(
            device_token, secrets.BACKEND_SECRET_KEY, algorithms=["HS256"]
        )
        device = await get_object_or_404(
            payload.get("device_id"), Device, session, "The device does not exist."
        )
    except (HTTPException, jwt.DecodeError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid device token")
    token_uuid = payload.get("token_uuid")
    if token_uuid != device.token_uuid or device_token != device.auth_token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid device token")
    return device


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
