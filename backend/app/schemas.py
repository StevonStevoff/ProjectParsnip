from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[int]):
    username: str


class UserCreate(schemas.BaseUserCreate):
    username: str


class UserUpdate(schemas.BaseUserUpdate):
    username: str


class PlantProfileBase(BaseModel):
    pass


class PlantProfileCreate(PlantProfileBase):
    pass


class PlantTypeBase(BaseModel):
    pass


class PlantTypeCreate(PlantTypeBase):
    pass
