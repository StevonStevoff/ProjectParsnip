from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table
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


class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column(Integer, primary_key=True)
    __tablename__ = "users"
    # email and hashed password created by fastapi_users parent class
    username = Column(String)

    plant_profiles = relationship(
        "PlantProfile", secondary=UserProfile, back_populates="user"
    )
    devices = relationship("Device", secondary=UserDevice, back_populates="users")


class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    users = relationship("User", secondary=UserDevice, back_populates="devices")
    plants = relationship("Plant", back_populates="device")


class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    device_id = Column(Integer, ForeignKey("devices.id"))
    plant_profile_id = Column(Integer, ForeignKey("plant_profiles.id"))
    plant_type_id = Column(Integer, ForeignKey("plant_types.id"))

    device = relationship("Device", back_populates="plants")
    plant_data = relationship("PlantData", back_populates="plant")
    plant_profile = relationship("PlantProfile")
    plant_type = relationship("PlantType")


class PlantData(Base):
    __tablename__ = "plant_data"
    id = Column(Integer, primary_key=True, index=True)
    telemetry_data = Column(String)
    timestamp = Column(DateTime)
    plant_id = Column(Integer, ForeignKey("plants.id"))

    plant = relationship("Plant", back_populates="plant_data")


class PlantType(Base):
    __tablename__ = "plant_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)


class PlantProfile(Base):
    __tablename__ = "plant_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    plant_type_id = Column(Integer, ForeignKey("plant_types.id"))

    plant_type = relationship("PlantType")
    user = relationship("User", secondary=UserProfile, back_populates="plant_profiles")
