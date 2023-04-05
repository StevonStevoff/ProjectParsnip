from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Device, Notification, Plant, PlantData, User
from app.router.utils import get_object_or_404


async def check_plant_properties(
    device: Device, plant: Plant, plant_data: PlantData, session: AsyncSession
) -> None:
    # Compare the plant_data values to growth property ranges
    # lookup device users
    # send notifications if needed to all users of device
    pass


async def send_user_notification_by_id(user_id: int, session: AsyncSession) -> None:
    user = await get_object_or_404(
        user_id, User, AsyncSession, "The user does not exist"
    )
    await send_user_notification(user, session)


async def send_user_notification(user: User, session: AsyncSession) -> None:
    # Create notification here
    # Add to database and link to user
    notification = Notification()
    notification.text = "Idk what to put here yet"
    pass
