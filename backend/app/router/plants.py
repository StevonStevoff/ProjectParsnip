from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import Device, Plant, PlantProfile, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_manage_object,
)
from app.schemas import PlantCreate, PlantRead, PlantUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_plant_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> Plant:
    return await get_object_or_404(id, Plant, session)


async def user_can_manage_device(
    user: User, device_id: int, session: AsyncSession = Depends(get_async_session)
):
    device = await get_object_or_404(device_id, Device, session)
    await user_can_manage_object(user, device.owner_id)


async def user_can_manage_plant_profile(
    user: User,
    plant_profile_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    plant_profile = await get_object_or_404(plant_profile_id, PlantProfile, session)
    await user_can_manage_object(user, plant_profile.owner_id)


@router.get(
    "/",
    name="plants:all_plants",
    response_model=list[PlantRead],
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No plants found",
        },
    },
)
async def get_all_plants(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
):
    if contains:
        plants_query = select(Plant).where(Plant.name.ilike(f"%{contains}%"))
    else:
        plants_query = select(Plant)

    results = await session.execute(plants_query)
    plants = results.scalars().all()

    return await model_list_to_schema(plants, PlantRead)


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
):
    return PlantRead.from_orm(plant)


@router.post(
    "/register",
    response_model=PlantCreate,
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
            "description": "The plant does not exist.",
        },
    },
)
async def register_plant(
    plant_create: PlantCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    plant = Plant()
    plant.name = plant_create.name
    plant.device_id = plant_create.device_id
    plant.plant_profile_id = plant_create.plant_profile_id
    plant.plant_type_id = plant_create.plant_type_id

    await user_can_manage_device(user, plant.device_id)
    await user_can_manage_plant_profile(user, plant.plant_profile_id)

    session.add(plant)
    await session.commit()
    await session.refresh(plant)

    created_plant = await session.get(Plant, plant.id)
    return PlantRead.from_orm(created_plant)


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
):
    pass


@router.patch(
    "/{id}",
    response_model=PlantUpdate,
    name="plants:patch_plant",
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
async def patch_plant(
    plant_update: PlantUpdate,
    plant: Plant = Depends(get_plant_or_404),
    session: AsyncSession = Depends(get_async_session),
):
    pass
