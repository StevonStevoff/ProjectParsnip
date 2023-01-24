from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import User
from app.schemas import UserRead, UserUpdate
from app.users import current_active_user, fastapi_users

router = APIRouter()


@router.get(
    "/",
    response_model=list[UserRead],
    name="users:all_users",
    dependencies=[Depends(current_active_user)],
    description="Request can be filtered by whole or part of username",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No users found",
        },
    },
)
async def get_all_users(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
):
    if contains:
        users_query = select(User).where(User.username.ilike(f"%{contains}%"))
    else:
        users_query = select(User)
    results = await session.execute(users_query)
    users = results.scalars().all()

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    user_list = [UserRead.from_orm(user) for user in users]
    return user_list


router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    tags=["users"],
)
# remove fastapi_users id route so we can write it ourselves
for route in router.routes:
    if route.name == "users:user":
        router.routes.remove(route)


@router.get(
    "/{id}",
    name="users:user",
    response_model=UserRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The user does not exist.",
        },
    },
)
async def get_user_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    user_query = select(User).where(User.id == id)
    result = await session.execute(user_query)
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return UserRead.from_orm(user)
