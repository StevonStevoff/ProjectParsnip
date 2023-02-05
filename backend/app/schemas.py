from typing import Optional

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[int]):
    id: int
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


class BaseRead(BaseModel):
    id: int

    class Config:
        orm_mode = True


class SensorBase(BaseModel):
    name: str
    description: str


class SensorRead(BaseRead, SensorBase):
    pass


class SensorCreate(SensorBase):
    pass


class SensorUpdate(SensorBase):
    name: Optional[str]
    description: Optional[str]


class DeviceBase(BaseModel):
    name: str
    model_name: str


class DeviceRead(BaseRead, DeviceBase):
    owner: UserRead
    users: list[UserRead]
    sensors: list[SensorRead]


class DeviceCreate(DeviceBase):
    sensor_ids: list[int]
    user_ids: list[int]


class DeviceUpdate(DeviceBase):
    name: Optional[str]
    sensor_ids: Optional[list[int]]
    new_owner_id: Optional[int]
    user_ids: Optional[list[int]]


class PlantTypeBase(BaseModel):
    name: str
    description: str


class PlantTypeRead(BaseRead, PlantTypeBase):
    user_created: bool
    creator: UserRead | None


class PlantTypeCreate(PlantTypeBase):
    pass


class PlantTypeUpdate(PlantTypeBase):
    name: Optional[str]
    description: Optional[str]


class PlantProfileBase(BaseModel):
    name: str
    description: str
    public: bool


class PlantProfileRead(BaseRead, PlantProfileBase):
    user_created: bool
    plant_type: PlantTypeRead
    creator: UserRead | None
    users: list[UserRead]


class PlantProfileCreate(PlantProfileBase):
    plant_type_id: int
    user_ids: list[int]


class PlantProfileUpdate(PlantProfileBase):
    name: Optional[str]
    description: Optional[str]
    public: Optional[bool]
    plant_type_id: Optional[int]
    user_ids: Optional[list[int]]


class PlantBase(BaseModel):
    name: str


class PlantRead(BaseRead, PlantBase):
    device_id = int
    plant_profile_id = int
    plant_type_id = int


class PlantCreate(PlantBase):
    device_id = int
    plant_profile_id = int
    plant_type_id = int


class PlantUpdate(PlantBase):
    name: Optional[str]
    device_id: Optional[int]
    # For some reason these fields cause import error for tests
    # confused
    # plant_profile_id = Optional[int]
    # plant_type_id = Optional[int]
