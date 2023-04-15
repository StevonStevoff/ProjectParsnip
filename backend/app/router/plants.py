from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_async_session
from app.models import Device, Plant, PlantProfile, PlantType, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_use_object,
)
from app.schemas import PlantCreate, PlantDataRead, PlantRead, PlantUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_plant_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> Plant:
    detail = "The plant does not exist."
    return await get_object_or_404(id, Plant, session, detail)


@router.get(
    "/",
    name="plants:all_plants",
    response_model=list[PlantRead],
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not superuser",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No plants found.",
        },
    },
)
async def get_all_plants(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
) -> list[PlantRead]:
    if contains:
        plants_query = select(Plant).where(Plant.name.ilike(f"%{contains}%"))
    else:
        plants_query = select(Plant)

    results = await session.execute(plants_query)
    plants = results.scalars().all()

    return await model_list_to_schema(plants, PlantRead, "No plants found.", session)


@router.get(
    "/me",
    name="plants:my_plants",
    response_model=list[PlantRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No plants found.",
        },
    },
)
async def get_my_plants(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> list[PlantRead]:
    user_device_ids = [device.id for device in user.devices]
    plants_query = await session.execute(
        select(Plant).where(Plant.device_id.in_(user_device_ids))
    )
    plants = plants_query.scalars().all()

    return await model_list_to_schema(plants, PlantRead, "No plants found.", session)


@router.post(
    "/register",
    response_model=PlantRead,
    dependencies=[Depends(current_active_user)],
    name="plants:register_plant",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not superuser or associated owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant device/profile/plant type does not exist.",
        },
    },
)
async def register_plant(
    plant_create: PlantCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> PlantRead:
    plant = Plant()
    plant.name = plant_create.name
    plant.outdoor = plant_create.outdoor

    await update_plant_device(plant, user, plant_create.device_id, session)
    await update_plant_profile(plant, user, plant_create.plant_profile_id, session)
    await update_plant_type(plant, plant_create.plant_type_id, session)

    if plant_create.longitude and plant_create.latitude:
        await update_plant_coordinates(
            plant, plant_create.latitude, plant_create.longitude
        )

    session.add(plant)
    await session.commit()
    await session.refresh(plant)

    created_plant = await session.get(Plant, plant.id, populate_existing=True)
    return PlantRead.from_orm(created_plant)


@router.get(
    "/{id}",
    response_model=PlantRead,
    name="plants:plant",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant does not exist.",
        },
    },
)
async def get_plant(
    plant: Plant = Depends(get_plant_or_404),
) -> PlantRead:
    return PlantRead.from_orm(plant)


@router.delete(
    "/{id}",
    name="plants:plant",
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not superuser or associated device owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant does not exist.",
        },
    },
)
async def delete_plant(
    plant: Plant = Depends(get_plant_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> None:
    await user_can_use_object(user, plant.device_id, Device, "device", session)
    await session.delete(plant)
    await session.commit()


@router.patch(
    "/{id}",
    name="plants:patch_plant",
    response_model=PlantRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not superuser or associated device owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The device/profile/type does not exist.",
        },
    },
)
async def patch_plant(
    plant_update: PlantUpdate,
    user: User = Depends(current_active_user),
    plant: Plant = Depends(get_plant_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> PlantRead:
    await user_can_use_object(user, plant.device_id, Device, "device", session)

    if plant_update.name is not None:
        plant.name = plant_update.name

    if plant_update.device_id is not None:
        await update_plant_device(plant, user, plant_update.device_id, session)

    if plant_update.plant_profile_id is not None:
        await update_plant_profile(plant, user, plant_update.plant_profile_id, session)

    if plant_update.plant_type_id is not None:
        await update_plant_type(plant, plant_update.plant_type_id, session)

    if plant_update.outdoor is not None:
        plant.outdoor = plant_update.outdoor

    if plant_update.time_planted is not None:
        await update_time_planted(plant, plant_update.time_planted)

    if plant_update.longitude is not None or plant_update.latitude is not None:
        await update_plant_coordinates(
            plant, plant_update.latitude, plant_update.longitude
        )

    await session.commit()
    await session.refresh(plant)
    updated_plant = await session.get(Plant, plant.id, populate_existing=True)
    return PlantRead.from_orm(updated_plant)


@router.get(
    "/{id}/data",
    name="plants:plant_data",
    response_model=list[PlantDataRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not superuser or associated device owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant does not exist",
        },
    },
)
async def get_plant_data(
    id: int,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    # custom query used to grab plant data
    plant_query = await session.execute(
        select(Plant).where(Plant.id == id).options(selectinload(Plant.plant_data))
    )
    plant = plant_query.scalars().first()
    if plant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The plant does not exist.")

    await user_can_use_object(user, plant.device_id, Device, "device", session)
    user = await session.merge(user)

    return await model_list_to_schema(
        plant.plant_data, PlantDataRead, "No plant data found.", session
    )


async def update_plant_device(
    plant: Plant, user: User, device_id: int, session: AsyncSession
) -> None:
    await user_can_use_object(user, device_id, Device, "device", session)
    await get_object_or_404(device_id, Device, session, "The device does not exist.")
    plant.device_id = device_id


async def update_plant_profile(
    plant: Plant, user: User, plant_profile_id: int, session: AsyncSession
) -> None:
    await user_can_use_object(
        user, plant_profile_id, PlantProfile, "plant profile", session
    )
    await get_object_or_404(
        plant_profile_id, PlantProfile, session, "The plant profile does not exist."
    )
    plant.plant_profile_id = plant_profile_id


async def update_plant_type(
    plant: Plant, plant_type_id: int, session: AsyncSession
) -> None:
    await get_object_or_404(
        plant_type_id, PlantType, session, "The plant type does not exist."
    )
    plant.plant_type_id = plant_type_id


async def update_plant_coordinates(
    plant: Plant, latitude: float | None, longitude: float | None
) -> None:
    error_msg = "Invalid "
    valid_latitude = True
    valid_longitude = True

    if latitude is not None:
        valid_latitude = abs(latitude) <= 90

    if longitude is not None:
        valid_longitude = abs(longitude) <= 180

    if not valid_latitude:
        error_msg += "Latitude"

    if not valid_longitude:
        if len(error_msg) > 8:
            error_msg += " and "
        error_msg += "Longitude"
    error_msg += "."

    if not valid_longitude or not valid_latitude:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, error_msg)

    if latitude is not None:
        plant.latitude = latitude
    if longitude is not None:
        plant.longitude = longitude


async def update_time_planted(plant: Plant, time_planted: datetime) -> None:
    current_time = datetime.now(timezone.utc)
    time_planted_utc = time_planted.astimezone(timezone.utc)
    if current_time < time_planted_utc:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Time planted cannot be in the future.",
        )

    plant.time_planted = time_planted_utc
