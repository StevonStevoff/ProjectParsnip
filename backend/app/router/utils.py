from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Base, User
from app.schemas import BaseRead


async def get_object_or_404(
    id: int, model_type: Base, session: AsyncSession, detail: str
) -> Base:
    model_query = await session.execute(select(model_type).where(model_type.id == id))
    model_object = model_query.scalars().first()

    if model_object is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail)
    return model_object


async def model_list_to_schema(
    model_list: list[Base],
    schema: BaseRead,
    detail: str,
    session: AsyncSession | None = None,
) -> BaseRead:
    if not model_list:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail)
    schema_list = []
    for model in model_list:
        if session:
            await session.refresh(model)
        schema_list.append(schema.from_orm(model))
    return schema_list


async def user_can_manage_object(user: User, object_manager_id: int) -> None:
    if object_manager_id != user.id and not user.is_superuser:
        raise HTTPException(status.HTTP_403_FORBIDDEN)


async def user_can_use_object(
    user: User,
    object_id: int,
    object_type: Base,
    object_name: str,
    session: AsyncSession,
) -> None:
    object = await get_object_or_404(
        object_id, object_type, session, detail=f"The {object_name} does not exist."
    )

    object_user_ids = [object_user.id for object_user in object.users]
    if user.id not in object_user_ids:
        if user.is_superuser:
            object.users.append(user)
        else:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                f"Not owner or user of {object_name} with ID {object_id}",
            )
