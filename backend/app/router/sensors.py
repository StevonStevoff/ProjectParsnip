from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import GrowPropertyType, Sensor
from app.router.utils import get_object_or_404, model_list_to_schema
from app.schemas import SensorCreate, SensorRead, SensorUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_sensor_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> Sensor:
    detail = "The sensor does not exist."
    return await get_object_or_404(id, Sensor, session, detail)


@router.get(
    "/",
    name="sensors:all_sensors",
    response_model=list[SensorRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No sensors found.",
        },
    },
)
async def get_all_sensors(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
) -> list[SensorRead]:
    if contains:
        sensors_query = select(Sensor).where(Sensor.name.ilike(f"%{contains}%"))
    else:
        sensors_query = select(Sensor)
    results = await session.execute(sensors_query)
    sensors = results.scalars().all()

    return await model_list_to_schema(sensors, SensorRead, "No sensors found.", session)


@router.post(
    "/register",
    name="sensors:register_sensor",
    response_model=SensorRead,
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or owner of device.",
        },
    },
)
async def register_sensor(
    sensor_create: SensorCreate, session: AsyncSession = Depends(get_async_session)
) -> SensorRead:
    sensor = Sensor()
    sensor.name = sensor_create.name
    sensor.description = sensor_create.description

    await update_sensor_grow_property_type_id(
        sensor, sensor_create.grow_property_type_id, session
    )

    session.add(sensor)
    await session.commit()
    await session.refresh(sensor)

    created_sensor = await session.get(Sensor, sensor.id, populate_existing=True)
    return SensorRead.from_orm(created_sensor)


@router.get(
    "/{id}",
    name="sensors:sensor",
    response_model=SensorRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The sensor does not exist.",
        },
    },
)
async def get_sensor_by_id(sensor: Sensor = Depends(get_sensor_or_404)) -> SensorRead:
    return SensorRead.from_orm(sensor)


@router.delete(
    "/{id}",
    name="sensors:delete_sensor",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or owner of device.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The sensor does not exist.",
        },
    },
)
async def delete_sensor(
    sensor: Sensor = Depends(get_sensor_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> None:
    await session.delete(sensor)
    await session.commit()


@router.patch(
    "/{id}",
    name="sensors:patch_sensor",
    response_model=SensorRead,
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or owner of device.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The sensor does not exist.",
        },
    },
)
async def patch_sensor(
    sensor_update: SensorUpdate,
    sensor: Sensor = Depends(get_sensor_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> SensorRead:
    if sensor_update.name:
        sensor.name = sensor_update.name

    if sensor_update.description:
        sensor.description = sensor_update.description

    if sensor_update.grow_property_type_id:
        await update_sensor_grow_property_type_id(
            sensor, sensor_update.grow_property_type_id, session
        )

    await session.commit()
    await session.refresh(sensor)
    return SensorRead.from_orm(sensor)


async def update_sensor_grow_property_type_id(
    sensor: Sensor, type_id: int, session: AsyncSession
) -> None:
    await get_object_or_404(
        type_id, GrowPropertyType, session, "The grow property type does not exist."
    )

    sensor.grow_property_type_id = type_id
