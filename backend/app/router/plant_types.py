from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import PlantType, User
from app.router.utils import (
    get_object_or_404,
    model_list_to_schema,
    user_can_manage_object,
)
from app.schemas import PlantTypeCreate, PlantTypeRead, PlantTypeUpdate
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_plant_type_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> PlantType:
    detail = "The plant type does not exist."
    return await get_object_or_404(id, PlantType, session, detail)


@router.get(
    "/",
    name="plant_types:all_plant_types",
    response_model=list[PlantTypeRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No plant types found.",
        },
    },
)
async def get_all_plant_types(
    session: AsyncSession = Depends(get_async_session), contains: str | None = None
):
    if contains:
        plant_types_query = select(PlantType).where(
            PlantType.name.ilike(f"%{contains}%")
        )
    else:
        plant_types_query = select(PlantType)
    results = await session.execute(plant_types_query)
    plant_types = results.scalars().all()

    return await model_list_to_schema(
        plant_types, PlantTypeRead, "No plant types found."
    )


@router.get(
    "/me",
    name="plant_types:my_plant_types",
    response_model=list[PlantTypeRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User has no created plant types.",
        },
    },
)
async def get_my_plant_types(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    plant_types_query = await session.execute(
        select(PlantType).where(PlantType.creator_id == user.id)
    )
    plant_types = plant_types_query.scalars().all()

    return await model_list_to_schema(
        plant_types, PlantTypeRead, "User has no created plant types."
    )


@router.post(
    "/register",
    response_model=PlantTypeRead,
    dependencies=[Depends(current_active_user)],
    name="plant_types:register_plant_type",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant type owner.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant type does not exist.",
        },
    },
)
async def register_plant_type(
    plant_type_create: PlantTypeCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    local_user = await session.merge(user)
    plant_type = PlantType()
    plant_type.name = plant_type_create.name
    plant_type.description = plant_type_create.description
    plant_type.creator = local_user

    # All plant types created through API are made by users
    # non user created types inserted directly through script
    plant_type.user_created = True

    session.add(plant_type)
    await session.commit()
    await session.refresh(plant_type)

    created_plant_type = await session.get(
        PlantType, plant_type.id, populate_existing=True
    )
    return PlantTypeRead.from_orm(created_plant_type)


@router.get(
    "/{id}",
    response_model=PlantTypeRead,
    name="plant_types:plant_type",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant type does not exist.",
        },
    },
)
async def get_plant_type(
    plant_type: PlantType = Depends(get_plant_type_or_404),
):
    return PlantTypeRead.from_orm(plant_type)


@router.delete(
    "/{id}",
    name="plant_types:delete_plant_type",
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant type creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The plant type does not exist.",
        },
    },
)
async def delete_plant_type(
    plant_type: PlantType = Depends(get_plant_type_or_404),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    await user_can_manage_object(user, plant_type.creator_id)
    await session.delete(plant_type)
    await session.commit()


@router.patch(
    "/{id}",
    dependencies=[Depends(current_active_user)],
    name="plant_types:patch_plant_type",
    response_model=PlantTypeRead,
)
async def patch_plant_type(
    plant_type_update: PlantTypeUpdate,
    user: User = Depends(current_active_user),
    plant_type: PlantType = Depends(get_plant_type_or_404),
    session: AsyncSession = Depends(get_async_session),
):
    await user_can_manage_object(user, plant_type.creator_id)
    if plant_type_update.name:
        plant_type.name = plant_type_update.name

    if plant_type_update.description:
        plant_type.description = plant_type_update.description

    await session.commit()
    await session.refresh(plant_type)
    return PlantTypeRead.from_orm(plant_type)
