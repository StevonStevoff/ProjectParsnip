from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Device, Notification, Plant, PlantData, User
from app.router.utils import get_object_or_404


async def check_plant_properties(
    device: Device, plant: Plant, plant_data: PlantData, session: AsyncSession
) -> None:
    # Compare the plant_data values to growth property ranges
    # lookup device users
    # send notifications if needed to all users of device

    out_of_range = []

    # check sensor readings in range
    for reading in plant_data.sensor_readings:
        if reading.value > reading.grow_property.max:
            out_of_range.append(reading.grow_property.name)
        elif reading.value < reading.grow_property.min:
            out_of_range.append(reading.grow_property.name)

    if len(out_of_range) > 0:
        users = device.users
        for user in users:
            notification_data = {
                "plant_id": plant.id,
                "plant_name": plant.name,
                "device_name": device.name,
                "properties": out_of_range,
            }
            await create_user_notification(user, session, notification_data)


async def create_user_notification_by_id(user_id: int, session: AsyncSession) -> None:
    user = await get_object_or_404(
        user_id, User, AsyncSession, "The user does not exist"
    )
    await create_user_notification(user, session)


async def create_user_notification(
    user: User, session: AsyncSession, data: dict
) -> None:
    # Create notification here
    # Add to database and link to user
    # "Your device {data["device_name"]} has detected {plant}'s
    # {growprop} is too high/low

    if len(data["properties"]) > 1:
        text = (
            f"Your device {data['device_name']} has detected that "
            f"{len(data['properties'])} of {data['plant_name']}'s "
            "properties are out of range!"
        )
    else:
        text = (
            f"Your device {data['device_name']} has detected "
            f"{data['plant_name']}'s {data['properties'][0]} "
            "is out of range!"
        )

    notification = Notification(
        text=text,
        resolved=False,
        timestamp=datetime.now(),
        plant_id=data["plant_id"],
    )

    session.add(notification)
    await session.commit()
