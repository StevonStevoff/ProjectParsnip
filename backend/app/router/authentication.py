from fastapi import APIRouter, Depends, Response
from fastapi_users.authentication import Strategy

from app.models import User
from app.users import auth_backend, current_active_user

router = APIRouter()


@router.post("/auth/jwt/refresh", name="auth:jwt:refresh")
async def refresh_jwt(
    response: Response,
    strategy: Strategy = Depends(auth_backend.get_strategy),
    user: User = Depends(current_active_user),
):
    return await auth_backend.login(strategy, user, response)
