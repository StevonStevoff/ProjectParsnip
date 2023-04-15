from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import GrowPropertyType
from app.router.utils import get_object_or_404, model_list_to_schema
from app.schemas import (
    GrowPropertyTypeCreate,
    GrowPropertyTypeRead,
    GrowPropertyTypeUpdate,
)
from app.users import current_active_superuser, current_active_user

router = APIRouter()


async def get_grow_property_type_or_404(
    id: int, session: AsyncSession = Depends(get_async_session)
) -> GrowPropertyType:
    detail = "The grow property type does not exist"
    return await get_object_or_404(id, GrowPropertyType, session, detail)


@router.get(
    "/",
    name="grow_property_types:all_grow_property_types",
    response_model=list[GrowPropertyTypeRead],
    dependencies=[Depends(current_active_user)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No grow property types found",
        },
    },
)
async def get_all_grow_property_types(
    session: AsyncSession = Depends(get_async_session), contains: Optional[str] = None
) -> list[GrowPropertyTypeRead]:
    if contains:
        grow_property_types_query = select(GrowPropertyType).where(
            GrowPropertyType.name.ilike(f"%{contains}%")
        )
    else:
        grow_property_types_query = select(GrowPropertyType)
    results = await session.execute(grow_property_types_query)
    grow_property_types = results.scalars().all()

    return await model_list_to_schema(
        grow_property_types,
        GrowPropertyTypeRead,
        "No grow property types found.",
        session,
    )


@router.post(
    "/register",
    name="grow_property_types:register_grow_property_type",
    response_model=GrowPropertyTypeRead,
    dependencies=[Depends(current_active_superuser)],
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
    },
)
async def register_grow_property_type(
    grow_property_type_create: GrowPropertyTypeCreate,
    session: AsyncSession = Depends(get_async_session),
) -> GrowPropertyTypeRead:
    grow_property_type = GrowPropertyType()
    grow_property_type.name = grow_property_type_create.name
    grow_property_type.description = grow_property_type_create.description

    session.add(grow_property_type)
    await session.commit()
    await session.refresh(grow_property_type)

    created_type = await session.get(
        GrowPropertyType, grow_property_type.id, populate_existing=True
    )
    return GrowPropertyTypeRead.from_orm(created_type)


@router.get(
    "/{id}",
    name="grow_property_types:grow_property_type",
    response_model=GrowPropertyTypeRead,
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property type does not exist.",
        },
    },
)
async def get_grow_property_type(
    grow_property_type: GrowPropertyType = Depends(get_grow_property_type_or_404),
) -> GrowPropertyTypeRead:
    return GrowPropertyTypeRead.from_orm(grow_property_type)


@router.delete(
    "/{id}",
    name="grow_property_types:delete_grow_property_type",
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property type does not exist.",
        },
    },
)
async def delete_grow_property_type(
    grow_property_type: GrowPropertyType = Depends(get_grow_property_type_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> None:
    await session.delete(grow_property_type)
    await session.commit()


@router.patch(
    "/{id}",
    name="grow_property_types:patch_grow_property_type",
    response_model=GrowPropertyTypeRead,
    dependencies=[Depends(current_active_superuser)],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing token or inactive user.",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not a superuser or plant profile creator.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The grow property type does not exist.",
        },
    },
)
async def patch_grow_property_type(
    grow_property_type_update: GrowPropertyTypeUpdate,
    grow_property_type: GrowPropertyType = Depends(get_grow_property_type_or_404),
    session: AsyncSession = Depends(get_async_session),
) -> GrowPropertyTypeRead:
    if grow_property_type_update.name:
        grow_property_type.name = grow_property_type_update.name

    if grow_property_type_update.description:
        grow_property_type.description = grow_property_type_update.description

    await session.commit()
    await session.refresh(grow_property_type)
    return GrowPropertyTypeRead.from_orm(grow_property_type)
