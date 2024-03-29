from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import GrowPropertyRange, PlantProfile, PlantType, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_manage_object,
)
from app.schemas import PlantProfileCreate, PlantProfileRead, PlantProfileUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_plant_profile_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> PlantProfile:
    detail = "The plant profile does not exist."
    return await get_object_or_404(id, PlantProfile, session, detail)


@router.get(
    "/",
    name="plant_profiles:all_plant_profiles",
    response_model=list[PlantProfileRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No plant profiles found.",
        },
    },
)
async def get_all_plant_profiles(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
    contains: str | None = None,
) -> list[PlantProfileRead]:
    if contains:
        profiles_query = select(PlantProfile).where(
            and_(
                PlantProfile.name.ilike(f"%{contains}%"),
                or_(
                    PlantProfile.public,
                    PlantProfile.creator_id == user.id,
                    user.is_superuser,
                ),
            )
        )
    else:
        profiles_query = select(PlantProfile).where(
            or_(
                PlantProfile.public,
                PlantProfile.creator_id == user.id,
                user.is_superuser,
            )
        )
    results = await session.execute(profiles_query)
    profiles = results.scalars().all()

    return await model_list_to_schema(
        profiles, PlantProfileRead, "No plant profiles found."
    )


@router.get(
    "/me",
    name="plant_profiles:my_plant_profiles",
    response_model=list[PlantProfileRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no created plant profiles.",
        },
    },
)
async def get_user_profiles(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> list[PlantProfileRead]:
    profiles_query = await session.execute(
        select(PlantProfile)
        .join(PlantProfile.users)
        .filter_by(id=user.id)
        .order_by(PlantProfile.id)
    )
    profiles = profiles_query.scalars().all()

    return await model_list_to_schema(
        profiles, PlantProfileRead, "User has no created plant profiles."
    )


@router.get(
    "/created",
    name="plant_profiles:created_plant_profiles",
    response_model=list[PlantProfileRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no created plant profiles.",
        },
    },
)
async def get_created_profiles(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> list[PlantProfileRead]:
    profiles_query = await session.execute(
        select(PlantProfile).where(PlantProfile.creator_id == user.id)
    )
    profiles = profiles_query.scalars().all()

    if not profiles:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "User has no created plant profiles.",
        )
    profile_list = [PlantProfileRead.from_orm(profile) for profile in profiles]
    return profile_list


@router.post(
    "/register",
    name="plant_profiles:register_plant_profile",
    response_model=PlantProfileRead,
    dependencies=[Depends(current_active_user)],
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Cannot remove creator from plant profile.",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
    },
)
async def register_plant_profile(
    plant_profile_create: PlantProfileCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> PlantProfileRead:
    local_user = await session.merge(user)
    plant_profile = PlantProfile()
    plant_profile.name = plant_profile_create.name
    plant_profile.description = plant_profile_create.description
    plant_profile.public = plant_profile_create.public
    plant_profile.creator = local_user

    await update_grow_duration(plant_profile, plant_profile_create.grow_duration)

    # All plant profiles created through API are made by users
    # non user created profiles inserted directly through script
    plant_profile.user_created = True

    await update_profile_plant_type(
        plant_profile, plant_profile_create.plant_type_id, session
    )

    plant_profile_create.user_ids.append(user.id)
    await update_plant_profile_users(
        plant_profile, plant_profile_create.user_ids, session
    )

    session.add(plant_profile)
    await session.commit()
    await session.refresh(plant_profile)

    created_profile = await session.get(
        PlantProfile, plant_profile.id, populate_existing=True
    )
    return PlantProfileRead.from_orm(created_profile)


@router.get(
    "/{id}",
    response_model=PlantProfileRead,
    name="plant_profiles:plant_profile",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant profile does not exist.",
        },
    },
)
async def get_plant_profile(
    plant_profile: PlantProfile = Depends(get_plant_profile_or_404),
) -> PlantProfileRead:
    return PlantProfileRead.from_orm(plant_profile)


@router.delete(
    "/{id}",
    name="plant_profiles:delete_plant_profile",
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant profile does not exist.",
        },
    },
)
async def delete_plant_profile(
    plant_profile: PlantProfile = Depends(get_plant_profile_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> None:
    await user_can_manage_object(user, plant_profile.creator_id)
    await session.delete(plant_profile)
    await session.commit()


@router.patch(
    "/{id}",
    name="plant_profiles:patch_plant_profile",
    response_model=PlantProfileRead,
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Cannot remove creator from plant profile.",
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or creator of plant profile.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant profile does not exist.",
        },
    },
)
async def patch_plant_profile(
    plant_profile_update: PlantProfileUpdate,
    plant_profile: PlantProfile = Depends(get_plant_profile_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> PlantProfileRead:
    try:
        await user_can_manage_object(user, plant_profile.creator_id)
        if plant_profile_update.name:
            plant_profile.name = plant_profile_update.name

        if plant_profile_update.description:
            plant_profile.description = plant_profile_update.description

        if plant_profile_update.public is not None:
            plant_profile.public = plant_profile_update.public

        if plant_profile_update.plant_type_id:
            await update_profile_plant_type(
                plant_profile, plant_profile_update.plant_type_id, session
            )

        if plant_profile_update.user_ids:
            await update_plant_profile_users(
                plant_profile, plant_profile_update.user_ids, session
            )

        if plant_profile_update.grow_duration:
            await update_grow_duration(
                plant_profile, plant_profile_update.grow_duration
            )

        if plant_profile_update.grow_property_ids:
            update_profile_grow_properties(
                plant_profile, plant_profile_update.grow_property_ids, session
            )
    except HTTPException:
        # non-creator users can add or remove themselves to public profiles
        if plant_profile.public and plant_profile_update.user_ids:
            await check_removing_or_adding_self(
                plant_profile, plant_profile_update, user.id
            )
            await update_plant_profile_users(
                plant_profile, plant_profile_update.user_ids, session
            )
        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN)

    await session.commit()
    await session.refresh(plant_profile)
    return PlantProfileRead.from_orm(plant_profile)


async def check_removing_or_adding_self(
    plant_profile: PlantProfile, plant_profile_update: PlantProfileUpdate, user_id
) -> None:
    existing_user_ids = [user.id for user in plant_profile.users]

    adding_self = plant_profile_update.user_ids == existing_user_ids + [user_id]

    if user_id in existing_user_ids:
        existing_user_ids.remove(user_id)
    removing_self = existing_user_ids == plant_profile_update.user_ids

    if not (removing_self or adding_self):
        raise HTTPException(status.HTTP_403_FORBIDDEN)


async def update_profile_plant_type(
    plant_profile: PlantProfile, plant_type_id: int, session: AsyncSession
) -> None:
    try:
        detail = "The plant type does not exist."
        plant_type = await get_object_or_404(plant_type_id, PlantType, session, detail)
    except HTTPException:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            f"No plant type with id ({plant_type_id}) found.",
        )

    plant_profile.plant_type = plant_type


async def update_plant_profile_users(
    plant_profile: PlantProfile, user_ids: list[int], session: AsyncSession
) -> None:
    unique_user_id_list = [*set(user_ids)]
    if plant_profile.creator.id not in unique_user_id_list:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Cannot remove plant profile creator from users.",
        )

    users_query = await session.execute(
        select(User).where(User.id.in_(unique_user_id_list))
    )
    plant_profile.users = users_query.scalars().all()


async def update_grow_duration(plant_profile: PlantProfile, grow_duration: int):
    if grow_duration < 0:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Grow duration cannot be less than zero.",
        )
    plant_profile.grow_duration = grow_duration


async def update_profile_grow_properties(
    plant_profile: PlantProfile, grow_property_ids: list[int], session: AsyncSession
) -> None:
    unique_grow_property_ids = [*set(grow_property_ids)]
    profile_grow_property_ids = [
        grow_property.id for grow_property in plant_profile.grow_properties
    ]
    if profile_grow_property_ids == unique_grow_property_ids:
        return

    for grow_property in unique_grow_property_ids:
        if grow_property not in profile_grow_property_ids:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "Cannot add new grow properties from plant profile route.",
            )

    grow_properties_query = await session.execute(
        select(GrowPropertyRange).where(
            GrowPropertyRange.id.in_(unique_grow_property_ids)
        )
    )
    plant_profile.grow_properties = grow_properties_query.scalars().all()
