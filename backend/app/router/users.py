from fastapi import APIRouter, Depends, File, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import app.router.imgutils as imgutils
from app.database import get_async_session
from app.models import User
from app.router.utils import get_object_or_404, model_list_to_schema
from app.schemas import PushToken, UserRead, UserUpdate
from app.users import current_active_user, fastapi_users

router = APIRouter()


async def get_user_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> User:
    detail = "The user does not exist."
    return await get_object_or_404(id, User, session, detail)


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
            "description": "No users found.",
        },
    },
)
async def get_all_users(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
) -> list[UserRead]:
    if contains:
        users_query = select(User).where(User.username.ilike(f"%{contains}%"))
    else:
        users_query = select(User)
    results = await session.execute(users_query)
    users = results.scalars().all()

    return await model_list_to_schema(users, UserRead, "No users found.")


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
async def get_user_by_id(user: User = Depends(get_user_or_404)) -> UserRead:
    return UserRead.from_orm(user)


@router.get(
    "/{id}/pfp",
    name="users:pfp",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The user does not exist.",
        },
    },
)
async def get_user_profile_picture(
    user: User = Depends(get_user_or_404),
) -> FileResponse:
    return FileResponse(await imgutils.get_user_pfp_path(user))


@router.post(
    "/pfp",
    name="users:pfp",
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
async def update_user_profile_picture(
    image: UploadFile = File(...), current_user: User = Depends(current_active_user)
):
    img = await imgutils.try_get_image(image)

    imgsize = img.size
    newimg = await imgutils.resize_image_for_profile(img)

    await imgutils.save_as_user_pfp(newimg, current_user)
    return {"size": imgsize}


@router.post(
    "/setPushToken",
    name="users:set_push_notification_token",
    status_code=status.HTTP_201_CREATED,
    response_model=UserRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
    },
)
async def set_push_notification_token(
    push_token: PushToken,
    current_user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    current_user.push_token = push_token.token
    await session.commit()
    await session.refresh(current_user)

    updated_user = await session.get(
        User,
        current_user.id,
        populate_existing=True,
    )

    return UserRead.from_orm(updated_user)
