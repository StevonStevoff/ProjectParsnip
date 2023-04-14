from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import GrowPropertyRange, GrowPropertyType, PlantProfile, Sensor, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_manage_object,
)
from app.schemas import GrowPropertyCreate, GrowPropertyRead, GrowPropertyUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_grow_property_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> GrowPropertyRange:
    detail = "The grow property does not exist."
    return await get_object_or_404(id, GrowPropertyRange, session, detail)


@router.get(
    "/",
    name="grow_properties:all_grow_properties",
    response_model=list[GrowPropertyRead],
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No grow properties found",
        },
    },
)
async def get_all_grow_properties(
    session: AsyncSession = Depends(get_async_session),
) -> list[GrowPropertyRead]:
    grow_properties_query = select(GrowPropertyRange)
    results = await session.execute(grow_properties_query)
    grow_properties = results.scalars().all()

    return await model_list_to_schema(
        grow_properties, GrowPropertyRead, "No grow properties found."
    )


@router.post(
    "/register",
    name="grow_properties:register_grow_property",
    response_model=GrowPropertyRead,
    dependencies=[Depends(current_active_user)],
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Range max cannot be less than min",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
    },
)
async def register_grow_property(
    grow_property_create: GrowPropertyCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> GrowPropertyRead:
    grow_property = GrowPropertyRange()

    await update_property_type(
        grow_property, grow_property_create.grow_property_type_id, session
    )

    await update_property_ranges(
        grow_property, grow_property_create.min, grow_property_create.max
    )

    await update_property_profile(
        grow_property, user, grow_property_create.plant_profile_id, session
    )

    await update_property_sensor(grow_property, grow_property_create.sensor_id, session)

    session.add(grow_property)
    await session.commit()
    await session.refresh(grow_property)

    created_property = await session.get(
        GrowPropertyRange, grow_property.id, populate_existing=True
    )
    return GrowPropertyRead.from_orm(created_property)


@router.get(
    "/{id}",
    name="grow_properties:grow_property",
    response_model=GrowPropertyRead,
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property does not exist.",
        },
    },
)
async def get_grow_property(
    grow_property: GrowPropertyRange = Depends(get_grow_property_or_404),
) -> GrowPropertyRead:
    return GrowPropertyRead.from_orm(grow_property)


@router.delete(
    "/{id}",
    name="grow_properties:delete_grow_property",
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property does not exist.",
        },
    },
)
async def delete_grow_property(
    grow_property: GrowPropertyRange = Depends(get_grow_property_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> None:
    plant_profile_creator_id = grow_property.plant_profile.creator_id
    await user_can_manage_object(user, plant_profile_creator_id)
    await session.delete(grow_property)
    await session.commit()


@router.patch(
    "/{id}",
    name="grow_properties:patch_grow_property",
    response_model=GrowPropertyRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Property maximum must be less than minimum.",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or creator of plant profile.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property does not exist.",
        },
    },
)
async def patch_grow_property(
    grow_property_update: GrowPropertyUpdate,
    grow_property: GrowPropertyRange = Depends(get_grow_property_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> GrowPropertyRead:
    plant_profile_creator_id = grow_property.plant_profile.creator_id
    await user_can_manage_object(user, plant_profile_creator_id)

    await update_property_ranges(
        grow_property, grow_property_update.min, grow_property_update.max
    )

    if grow_property_update.grow_property_type_id:
        await update_property_type(
            grow_property, grow_property_update.grow_property_type_id, session
        )

    if grow_property_update.plant_profile_id:
        await update_property_profile(
            grow_property, user, grow_property_update.plant_profile_id, session
        )

    if grow_property_update.sensor_id:
        await update_property_sensor(
            grow_property, grow_property_update.sensor_id, session
        )

    await session.commit()
    await session.refresh(grow_property)
    return GrowPropertyRead.from_orm(grow_property)


async def update_property_type(
    grow_property: GrowPropertyRange, type_id: int, session: AsyncSession
) -> None:
    await get_object_or_404(
        type_id, GrowPropertyType, session, "The grow property type does not exist."
    )

    grow_property.grow_property_type_id = type_id


async def update_property_ranges(
    grow_property: GrowPropertyRange, min: Optional[float], max: Optional[float]
) -> None:
    if not min and not max:
        return
    elif not min:
        min = grow_property.min
    elif not max:
        max = grow_property.max

    if max < min:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Range max cannot be less than min.",
        )

    grow_property.min = min
    grow_property.max = max


async def update_property_profile(
    grow_property: GrowPropertyRange,
    user: User,
    plant_profile_id: int,
    session: AsyncSession,
) -> None:
    plant_profile = await get_object_or_404(
        plant_profile_id, PlantProfile, session, "The plant profile does not exist."
    )
    await user_can_manage_object(user, plant_profile.creator_id)
    grow_property.plant_profile_id = plant_profile_id


async def update_property_sensor(
    grow_property: GrowPropertyRange, sensor_id: int, session: AsyncSession
) -> None:
    await get_object_or_404(sensor_id, Sensor, session, "The sensor does not exist.")
    grow_property.sensor_id = sensor_id
