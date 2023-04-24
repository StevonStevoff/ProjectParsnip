from datetime import datetime

from exponent_server_sdk import DeviceNotRegisteredError, PushClient, PushMessage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Device, Notification, Plant, PlantData


async def get_recent_notification(
    plant: Plant, session: AsyncSession
) -> Notification | None:
    query = (
        select(Notification)
        .where(Notification.plant_id == plant.id)
        .order_by(Notification.timestamp.desc())
    )
    query_result = await session.execute(query)
    notification = query_result.scalars().first()

    return notification


# check if there is enough time between notifications for a plant
async def check_recent_notification(plant: Plant, session: AsyncSession) -> bool:
    notification = await get_recent_notification(plant, session)

    if notification:
        time_delta = datetime.now() - notification.timestamp
        time_delta = time_delta.total_seconds() / 60
    else:
        return True

    # wait a day if notification did not resolve
    if (not notification.resolved) and (time_delta < 1440):
        return False
    # wait an hour if notification was resolved
    elif (notification.resolved) and (time_delta < 60):
        return False
    else:
        return True


async def resolve_last_notification(plant: Plant, session: AsyncSession) -> None:
    notification = await get_recent_notification(plant, session)

    if notification:
        notification.resolved = True
        await session.commit()


# returns a list of grow property names from plant data that
# are out of the desired range
async def get_out_of_range_properties(plant_data: PlantData) -> list:
    out_of_range = []

    for reading in plant_data.sensor_readings:
        if not reading.grow_property:
            continue

        if reading.value > reading.grow_property.max:
            out_of_range.append(reading.grow_property.grow_property_type.name)
        elif reading.value < reading.grow_property.min:
            out_of_range.append(reading.grow_property.grow_property_type.name)

    return out_of_range


async def check_plant_properties(
    device: Device, plant: Plant, plant_data: PlantData, session: AsyncSession
) -> None:
    # Compare the plant_data values to growth property ranges
    # lookup device users
    # send notifications if needed to all users of device

    should_send_notification = await check_recent_notification(plant, session)

    out_of_range = await get_out_of_range_properties(plant_data)

    if len(out_of_range) > 0:
        if should_send_notification:
            notification_data = {
                "plant_id": plant.id,
                "plant_name": plant.name,
                "device_name": device.name,
                "properties": out_of_range,
            }
            await create_user_notification(device.users, session, notification_data)

    else:
        await resolve_last_notification(plant, session)


async def create_user_notification(
    users: list, session: AsyncSession, data: dict
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

    for user in users:
        user.notifications.append(notification)

    await session.commit()

    await send_push_notification(notification, session)


async def send_push_notification(notification: Notification, session: AsyncSession):
    for user in notification.users:
        if not user.push_token:
            continue

        response = PushClient().publish(
            PushMessage(
                to=user.push_token,
                title="Project Parsnip",
                body=notification.text,
                data={"plant_id": notification.plant_id},
            )
        )

        try:
            response.validate_response()
        except DeviceNotRegisteredError:
            user.push_token = None
            session.commit()
