from typing import Optional

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[int]):
    username: str
    name: str

    class Config:
        orm_mode = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    name: str


class UserUpdate(schemas.BaseUserUpdate):
    username: str
    name: str


class DeviceBase(BaseModel):
    name: str
    model_name: str


class DeviceRead(DeviceBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class DeviceCreate(DeviceBase):
    sensor_ids: Optional[list[int]]
    user_ids: Optional[list[int]]


class DeviceUpdate(DeviceBase):
    name: Optional[str]
    sensor_ids: Optional[list[int]]
    new_owner_id: Optional[int]
    user_ids: Optional[list[int]]


class PlantProfileBase(BaseModel):
    name: str
    description: str
    plant_type_id: int


class PlantProfileRead(PlantProfileBase):
    id: int

    class Config:
        orm_mode = True


class PlantProfileCreate(PlantProfileBase):
    pass


class PlantProfileUpdate(PlantProfileBase):
    pass


class PlantTypeBase(BaseModel):
    name: str
    description: str


class PlantTypeRead(PlantTypeBase):
    id: int

    class Config:
        orm_mode = True


class PlantTypeCreate(PlantTypeBase):
    pass
