from datetime import timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Security, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.authentication import device_auth_header, verify_device_token
from app.database import get_async_session
from app.models import Device, Plant, PlantData, PlantProfile, Sensor, SensorReading
from app.notifications import check_plant_properties
from app.router.utils import get_object_or_404, model_list_to_schema
from app.schemas import PlantDataCreate, PlantDataRead, SensorReadingCreate

router = APIRouter()


@router.post(
    "/",
    name="plant_data:send_plant_data",
    response_model=list[PlantDataRead],
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant/device does not exist",
        },
    },
)
async def create_plant_data(
    plant_data_create: PlantDataCreate,
    background_tasks: BackgroundTasks,
    device_token: str = Security(device_auth_header),
    session: AsyncSession = Depends(get_async_session),
) -> list[PlantDataRead]:
    await verify_device_token(device_token, session)
    # Grab device and associated plants
    device_query = await session.execute(
        select(Device)
        .where(Device.id == plant_data_create.device_id)
        .options(selectinload(Device.plants))
    )
    device = device_query.scalars().first()
    if device is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The device does not exist.")

    plant_data_list = []
    for plant in device.plants:
        plant_data = PlantData()

        utc_timestamp = plant_data_create.timestamp.astimezone(timezone.utc)
        plant_data.timestamp = utc_timestamp
        plant_data.plant_id = plant.id

        session.add(plant_data)
        await session.flush()

        await add_sensor_readings(
            plant_data, plant_data_create.sensor_readings, plant, session
        )
        await session.commit()
        await session.refresh(plant_data)
        await session.refresh(device)

        background_tasks.add_task(
            check_plant_properties, device, plant, plant_data, session
        )
        plant_data_list.append(plant_data)

    return await model_list_to_schema(
        plant_data_list, PlantDataRead, "No plant data found.", session
    )


async def add_sensor_readings(
    plant_data: PlantData,
    sensor_readings: list[SensorReadingCreate],
    plant: Plant,
    session: AsyncSession,
) -> None:
    sensor_to_property = await map_sensors_to_properties(
        plant.plant_profile_id, session
    )

    for reading in sensor_readings:
        created_reading = await create_sensor_reading(
            plant_data.id, reading, sensor_to_property, session
        )
        session.add(created_reading)
        await session.flush()


async def create_sensor_reading(
    plant_data_id: int,
    sensor_reading: SensorReadingCreate,
    sensor_to_property: dict,
    session: AsyncSession,
) -> SensorReading:
    await get_object_or_404(
        sensor_reading.sensor_id, Sensor, session, "The sensor does not exist."
    )

    reading = SensorReading()
    reading.value = sensor_reading.value
    reading.sensor_id = sensor_reading.sensor_id
    reading.plant_data_id = plant_data_id

    property_id = sensor_to_property.get(sensor_reading.sensor_id)
    if property_id:
        reading.grow_property_id = property_id

    return reading


async def map_sensors_to_properties(
    plant_profile_id: int, session: AsyncSession
) -> dict:
    sensor_to_property_dictionary = {}
    plant_profile = await get_object_or_404(
        plant_profile_id, PlantProfile, session, "The plant profile does not exist."
    )
    for property in plant_profile.grow_properties:
        sensor_to_property_dictionary[property.sensor_id] = property.id

    return sensor_to_property_dictionary
