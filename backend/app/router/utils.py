from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Base, User
from app.schemas import BaseRead


async def get_object_or_404(id: int, model_type: Base, session: AsyncSession):
    model_query = await session.execute(select(model_type).where(model_type.id == id))
    model_object = model_query.scalars().first()

    if model_object is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return model_object


async def model_list_to_schema(model_list: list[Base], schema: BaseRead):
    if not model_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return [schema.from_orm(model) for model in model_list]


async def user_can_manage_object(user: User, object_manager_id: int):
    if object_manager_id != user.id and not user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
