from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import Device, Plant, PlantProfile, PlantType, User
from app.router.utils import get_object_or_404, model_list_to_schema
from app.schemas import PlantCreate, PlantRead, PlantUpdate
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

    return await model_list_to_schema(plants, PlantRead, "No plants found.")


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

    return await model_list_to_schema(plants, PlantRead, "No plants found.")


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

    await update_plant_device(plant, user, plant_create.device_id, session)
    await update_plant_profile(plant, user, plant_create.plant_profile_id, session)
    await update_plant_type(plant, plant_create.plant_type_id, session)

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
    pass


@router.patch(
    "/{id}",
    response_model=PlantRead,
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
            "description": "The device/profile/type does not exist.",
        },
    },
)
async def patch_plant(
    plant_update: PlantUpdate,
    plant: Plant = Depends(get_plant_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> PlantRead:
    pass


async def update_plant_device(
    plant: Plant, user: User, device_id: int, session: AsyncSession
) -> None:
    device = await get_object_or_404(
        device_id, Device, session, "The device does not exist."
    )
    device_user_ids = [user.id for user in device.users]
    if user.id not in device_user_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not owner or user of device with ID {device_id}",
        )

    plant.device_id = device_id


async def update_plant_profile(
    plant: Plant, user: User, plant_profile_id: int, session: AsyncSession
) -> None:
    plant_profile = await get_object_or_404(
        plant_profile_id, PlantProfile, session, "The plant profile does not exist."
    )
    plant_profile_user_ids = [user.id for user in plant_profile.users]
    if user.id not in plant_profile_user_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Not owner or user of plant_profile with ID {plant_profile_id}",
        )

    plant.plant_profile_id = plant_profile_id


async def update_plant_type(
    plant: Plant, plant_type_id: int, session: AsyncSession
) -> None:
    await get_object_or_404(
        plant_type_id, PlantType, session, "The plant type does not exist."
    )
    plant.plant_type_id = plant_type_id
