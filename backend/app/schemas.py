from datetime import datetime
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


class GrowPropertyTypeBase(BaseModel):
    name: str
    description: str


class GrowPropertyTypeCreate(GrowPropertyTypeBase):
    pass


class GrowPropertyTypeRead(BaseRead, GrowPropertyTypeBase):
    pass


class GrowPropertyTypeUpdate(GrowPropertyTypeBase):
    name: Optional[str]
    description: Optional[str]


class SensorBase(BaseModel):
    name: str
    description: str


class SensorRead(BaseRead, SensorBase):
    grow_property_type: GrowPropertyTypeRead


class SensorCreate(SensorBase):
    grow_property_type_id: int


class SensorUpdate(SensorBase):
    name: Optional[str]
    description: Optional[str]
    grow_property_type_id: Optional[int]


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


class GrowPropertyBase(BaseModel):
    min: float
    max: float
    sensor_id: int


class GrowPropertyCreate(GrowPropertyBase):
    grow_property_type_id: int
    plant_profile_id: int


class GrowPropertyRead(BaseRead, GrowPropertyBase):
    grow_property_type: GrowPropertyTypeRead


class GrowPropertyUpdate(GrowPropertyBase):
    min: Optional[float]
    max: Optional[float]
    sensor_id: Optional[int]
    grow_property_type_id: Optional[int]
    plant_profile_id: Optional[int]


class SensorReadingBase(BaseModel):
    value: float


class SensorReadingRead(BaseRead, SensorReadingBase):
    grow_property: Optional[GrowPropertyRead]


class SensorReadingCreate(SensorReadingBase):
    sensor_id: int


class SensorReadingUpdate(SensorReadingBase):
    value: Optional[float]
    timestamp: Optional[datetime]
    sensor_id: Optional[int]
    grow_property_id: Optional[int]
    plant_data_id: Optional[int]


class PlantProfileBase(BaseModel):
    name: str
    description: str
    public: bool
    grow_duration: int | None


class PlantProfileRead(BaseRead, PlantProfileBase):
    user_created: bool
    plant_type: PlantTypeRead | None
    creator: UserRead | None
    users: list[UserRead]
    grow_properties: list[GrowPropertyRead] | None


class PlantProfileCreate(PlantProfileBase):
    plant_type_id: int
    user_ids: list[int]
    grow_duration: int


class PlantProfileUpdate(PlantProfileBase):
    name: Optional[str]
    description: Optional[str]
    public: Optional[bool]
    plant_type_id: Optional[int]
    user_ids: Optional[list[int]]
    grow_duration: Optional[int]
    grow_property_ids: Optional[list[int]]


class PlantBase(BaseModel):
    name: str


class PlantRead(BaseRead, PlantBase):
    device: DeviceRead
    plant_profile: PlantProfileRead | None
    plant_type: PlantTypeRead | None
    time_planted: datetime | None
    outdoor: bool | None
    latitude: float | None
    longitude: float | None


class PlantCreate(PlantBase):
    device_id: int
    plant_profile_id: int
    plant_type_id: int
    outdoor: bool
    latitude: Optional[float]
    longitude: Optional[float]


class PlantUpdate(PlantBase):
    name: Optional[str]
    device_id: Optional[int]
    plant_profile_id: Optional[int]
    plant_type_id: Optional[int]
    time_planted: Optional[datetime]
    outdoor: Optional[bool]
    latitude: Optional[float]
    longitude: Optional[float]


class PlantDataBase(BaseModel):
    timestamp: datetime


class PlantDataCreate(PlantDataBase):
    device_id: int
    plant_ids: list[int]
    sensor_readings: list[SensorReadingCreate]


class PlantDataRead(BaseRead, PlantDataBase):
    plant_id: int
    sensor_readings: list[SensorReadingRead]


class NotificationBase(BaseModel):
    text: str
    resolved: bool
    timestamp: datetime


class NotificationRead(BaseRead, NotificationBase):
    plant: PlantRead
