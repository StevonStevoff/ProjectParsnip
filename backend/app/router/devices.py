from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import Device, Sensor, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_manage_object,
)
from app.schemas import DeviceCreate, DeviceRead, DeviceUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_device_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> Device:
    return await get_object_or_404(id, Device, session)


@router.get(
    "/me",
    name="devices:my_devices",
    response_model=list[DeviceRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no devices",
        },
    },
)
async def get_user_devices(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    devices_query = await session.execute(
        select(Device).join(Device.users).filter_by(id=user.id)
    )
    devices = devices_query.scalars().all()

    return await model_list_to_schema(devices, DeviceRead)


@router.get(
    "/owned",
    response_model=list[DeviceRead],
    dependencies=[Depends(current_active_user)],
    name="devices:owned_devices",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no owned devices",
        },
    },
)
async def get_owned_devices(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    devices_query = await session.execute(
        select(Device).where(Device.owner_id == user.id)
    )
    devices = devices_query.scalars().all()

    return await model_list_to_schema(devices, DeviceRead)


@router.post(
    "/register",
    response_model=DeviceRead,
    name="devices:register_device",
    dependencies=[Depends(current_active_user)],
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The device does not exist.",
        },
    },
)
async def register_device(
    device_create: DeviceCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    local_user = await session.merge(user)
    device = Device()
    device.name = device_create.name
    device.model_name = device_create.model_name
    device.owner = local_user

    await update_device_sensors(device, device_create.sensor_ids, session)

    device_create.user_ids.append(user.id)
    await update_device_users(device, device_create.user_ids, session)

    session.add(device)
    await session.commit()
    await session.refresh(device)

    created_device = await session.get(Device, device.id)
    return DeviceRead.from_orm(created_device)


@router.get(
    "/{id}",
    response_model=DeviceRead,
    name="devices:device",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or device owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The device does not exist.",
        },
    },
)
async def get_device(
    device: Device = Depends(get_device_or_404),
):
    return DeviceRead.from_orm(device)


@router.delete(
    "/{id}",
    name="devices:delete_device",
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or device owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The device does not exist.",
        },
    },
)
async def delete_device(
    device: Device = Depends(get_device_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    await user_can_manage_object(user, device.owner_id)
    await session.delete(device)
    await session.commit()


@router.patch(
    "/{id}",
    response_model=DeviceRead,
    name="devices:patch_device",
    dependencies=[Depends(current_active_user)],
    description=(
        "for sensor and user lists, API will only update list for sensors and users"
        " which actually exist"
    ),
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Cannot remove owner from device",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or owner of device.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The device does not exist.",
        },
    },
)
async def patch_device(
    device_update: DeviceUpdate,
    user: User = Depends(current_active_user),
    device: Device = Depends(get_device_or_404),
    session: AsyncSession = Depends(get_async_session),
):
    await user_can_manage_object(user, Device, device.owner_id)
    if device_update.name:
        device.name = device_update.name

    if device_update.model_name:
        device.model_name = device_update.model_name

    if device_update.sensor_ids:
        await update_device_sensors(device, device_update.sensor_ids, session)

    if device_update.new_owner_id:
        await update_device_owner(device, device_update.new_owner_id, session)

    if device_update.user_ids:
        await update_device_users(device, device_update.user_ids, session)

    await session.commit()
    return DeviceRead.from_orm(device)


async def update_device_sensors(
    device: Device, sensor_ids: list[int], session: AsyncSession
):
    sensors_query = select(Sensor).where(Sensor.id.in_(sensor_ids))
    results = await session.execute(sensors_query)
    sensor_list = results.scalars().all()

    if sensor_list:
        device.sensors = sensor_list


async def update_device_owner(device: Device, new_owner_id: int, session: AsyncSession):
    try:
        user = await get_object_or_404(new_owner_id, User, session)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user with id ({new_owner_id}) found when updating device owner",
        )

    if device not in user.devices:
        user.devices.append(device)

    device.owner_id = user.id
    device.owner = user


async def update_device_users(
    device: Device, user_ids: list[int], session: AsyncSession
):
    unique_user_id_list = [*set(user_ids)]
    if device.owner.id not in user_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove device owner from users",
        )

    users_query = await session.execute(
        select(User).where(User.id.in_(unique_user_id_list))
    )
    user_list = users_query.scalars().all()

    local_user_list = []
    # check if this is necessary
    for user in user_list:
        local_user = await session.merge(user)
        local_user_list.append(local_user)

    if local_user_list:
        device.users = local_user_list

        # TODO: Check whether editing this relationship is reflected on user databsae
