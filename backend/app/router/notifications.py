from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import Notification, User
from app.router.utils import model_list_to_schema
from app.schemas import NotificationRead
from app.users import current_active_user

router = APIRouter()


@router.get(
    "/me",
    response_model=list[NotificationRead],
    name="notifications:my_notifications",
    dependencies=[Depends(current_active_user)],
    description="Get All Notifications for logged in user",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no notifications",
        },
    },
)
async def get_my_notifications(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> list[NotificationRead]:
    notifications_query = await session.execute(
        select(Notification)
        .join(Notification.users)
        .filter_by(id=user.id)
        .order_by(Notification.timestamp.desc())
    )
    notifications = notifications_query.scalars().all()

    return await model_list_to_schema(
        notifications, NotificationRead, "User has no notifications"
    )
