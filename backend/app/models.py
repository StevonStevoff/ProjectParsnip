from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

UserProfile = Table(
    "user_profiles",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("profile_id", Integer, ForeignKey("plant_profiles.id")),
)

UserDevice = Table(
    "user_devices",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("device_id", Integer, ForeignKey("devices.id")),
)

UserNotifications = Table(
    "user_notifications",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("notification_id", Integer, ForeignKey("notifications.id")),
)

DeviceSensors = Table(
    "device_sensors",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("device_id", Integer, ForeignKey("devices.id")),
    Column("sensor_id", Integer, ForeignKey("sensors.id")),
)


class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column(Integer, primary_key=True, index=True)
    __tablename__ = "users"
    # email and hashed password created by fastapi_users parent class
    username = Column(String)
    name = Column(String)

    plant_profiles = relationship(
        "PlantProfile",
        secondary=UserProfile,
        back_populates="users",
    )
    devices = relationship(
        "Device",
        secondary=UserDevice,
        back_populates="users",
        lazy="selectin",
    )
    notifications = relationship(
        "Notification",
        secondary=UserNotifications,
        back_populates="users",
        lazy="selectin",
    )


class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    model_name = Column(String)
    auth_token = Column(String)
    token_uuid = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", lazy="selectin")
    users = relationship(
        "User",
        secondary=UserDevice,
        back_populates="devices",
        lazy="selectin",
    )
    plants = relationship(
        "Plant",
        back_populates="device",
        lazy="selectin",
    )
    sensors = relationship(
        "Sensor", secondary=DeviceSensors, back_populates="devices", lazy="selectin"
    )


class Sensor(Base):
    __tablename__ = "sensors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

    grow_property_type_id = Column(Integer, ForeignKey("grow_property_types.id"))

    grow_property_type = relationship(
        "GrowPropertyType",
        lazy="selectin",
    )
    devices = relationship(
        "Device",
        secondary=DeviceSensors,
        back_populates="sensors",
    )


class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    device_id = Column(Integer, ForeignKey("devices.id"))
    plant_profile_id = Column(Integer, ForeignKey("plant_profiles.id"))
    plant_type_id = Column(Integer, ForeignKey("plant_types.id"))
    time_planted = Column(DateTime(timezone=True))
    outdoor = Column(Boolean)
    latitude = Column(Float)
    longitude = Column(Float)

    device = relationship(
        "Device",
        back_populates="plants",
        lazy="selectin",
    )
    plant_data = relationship(
        "PlantData",
        back_populates="plant",
    )
    plant_profile = relationship(
        "PlantProfile",
        lazy="selectin",
    )
    plant_type = relationship(
        "PlantType",
        lazy="selectin",
    )


class PlantData(Base):
    __tablename__ = "plant_data"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True))

    plant_id = Column(Integer, ForeignKey("plants.id"))

    plant = relationship(
        "Plant",
        back_populates="plant_data",
        lazy="selectin",
    )
    sensor_readings = relationship(
        "SensorReading",
        back_populates="plant_data",
        lazy="selectin",
    )


class PlantType(Base):
    __tablename__ = "plant_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    user_created = Column(Boolean)

    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("User", lazy="selectin")


class PlantProfile(Base):
    __tablename__ = "plant_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    public = Column(Boolean)
    user_created = Column(Boolean)
    grow_duration = Column(Integer)

    plant_type_id = Column(Integer, ForeignKey("plant_types.id"))
    creator_id = Column(Integer, ForeignKey("users.id"))

    plant_type = relationship(
        "PlantType",
        lazy="selectin",
    )
    creator = relationship("User", lazy="selectin")
    users = relationship(
        "User",
        secondary=UserProfile,
        back_populates="plant_profiles",
        lazy="selectin",
    )
    grow_properties = relationship(
        "GrowPropertyRange",
        lazy="selectin",
    )


class GrowPropertyType(Base):
    __tablename__ = "grow_property_types"
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class GrowPropertyRange(Base):
    __tablename__ = "grow_property_ranges"
    id = Column(Integer, primary_key=True, nullable=False)
    min = Column(Float, nullable=False)
    max = Column(Float, nullable=False)

    grow_property_type_id = Column(Integer, ForeignKey("grow_property_types.id"))
    plant_profile_id = Column(Integer, ForeignKey("plant_profiles.id"))
    sensor_id = Column(Integer, ForeignKey("sensors.id"))

    grow_property_type = relationship(
        "GrowPropertyType",
        lazy="selectin",
    )
    plant_profile = relationship(
        "PlantProfile",
        back_populates="grow_properties",
        lazy="selectin",
    )


class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, nullable=False)
    value = Column(Float, nullable=False)

    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    grow_property_id = Column(Integer, ForeignKey("grow_property_ranges.id"))
    plant_data_id = Column(Integer, ForeignKey("plant_data.id"))

    plant_data = relationship(
        "PlantData",
        back_populates="sensor_readings",
        lazy="selectin",
    )
    grow_property = relationship(
        "GrowPropertyRange",
        lazy="selectin",
    )


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, nullable=False)
    text = Column(String)
    resolved = Column(Boolean)
    timestamp = Column(DateTime(timezone=True))
    plant_id = Column(Integer, ForeignKey("plants.id"))

    plant = relationship("Plant", lazy="selectin")
    users = relationship(
        "User",
        secondary=UserNotifications,
        back_populates="notifications",
        lazy="selectin",
    )
