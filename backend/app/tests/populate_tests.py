from fastapi_users.password import PasswordHelper

from app.models import (
    Device,
    GrowPropertyRange,
    GrowPropertyType,
    Plant,
    PlantProfile,
    PlantType,
    Sensor,
    User,
)
from app.tests.conftest import get_db


async def populate_db():
    await add_users()
    await add_grow_property_types()
    await add_sensors()
    await add_devices()
    await add_plant_types()
    await add_plant_profiles()
    await add_plants()
    await add_grow_properties()


async def add_grow_properties():
    async for session in get_db():
        test_grow_properties = []
        test_grow_properties.append(
            GrowPropertyRange(
                min=10,
                max=50,
                grow_property_type_id=1,
                plant_profile_id=2,
                sensor_id=1,
            )
        )
        test_grow_properties.append(
            GrowPropertyRange(
                min=50,
                max=100,
                grow_property_type_id=2,
                plant_profile_id=3,
                sensor_id=2,
            )
        )

        for grow_property in test_grow_properties:
            session.add(grow_property)
        await session.commit()
        break


async def add_grow_property_types():
    async for session in get_db():
        test_grow_property_types = []
        test_grow_property_types.append(
            GrowPropertyType(
                name="Test Temperature",
                description="Temperature Data values, stored in Degrees C",
            )
        )
        test_grow_property_types.append(
            GrowPropertyType(
                name="Test Moisture",
                description="Moisture description",
            )
        )

        for grow_property_type in test_grow_property_types:
            session.add(grow_property_type)
        await session.commit()
        break


async def add_users():
    async for session in get_db():
        hashed_pwd = PasswordHelper().hash("password")
        test_users = []
        # id=1 and id=2 are already in use
        test_users.append(
            User(
                id=3,
                email="user1@test.com",
                username="username1",
                name="user",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )
        test_users.append(
            User(
                id=4,
                email="user2@test.com",
                username="username2",
                name="name",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )
        test_users.append(
            User(
                id=5,
                email="user3@test.com",
                username="username3",
                name="username",
                hashed_password=hashed_pwd,
                is_active=True,
                is_superuser=False,
            )
        )

        for test_user in test_users:
            session.add(test_user)
        await session.commit()
        break


async def add_devices():
    async for session in get_db():
        user_1 = await session.get(User, 1)
        user_2 = await session.get(User, 2)
        test_devices = []
        test_devices.append(
            Device(
                name="Plant Test Device",
                model_name="unit testing model",
                owner_id=2,
                users=[user_2],
            )
        )
        test_devices.append(
            Device(
                name="Plant Admin Test Device",
                model_name="unit testing model",
                owner_id=1,
                users=[user_1],
            )
        )
        for test_device in test_devices:
            session.add(test_device)
        await session.commit()
        break


async def add_sensors():
    async for session in get_db():
        test_sensors = []
        test_sensors.append(
            Sensor(
                id=1,
                name="sensor1",
                description="this is a description",
                grow_property_type_id=1,
            )
        )
        test_sensors.append(
            Sensor(
                id=2,
                name="sensor2",
                description="this is also a description",
                grow_property_type_id=2,
            )
        )

        for sensor in test_sensors:
            session.add(sensor)
        await session.commit()
        break


async def add_plant_types():
    async for session in get_db():
        test_plant_types = []
        test_plant_types.append(
            PlantType(
                name="Test Admin Parsnip",
                description="This is a Test Parsnip Type, not created by a user",
                user_created=False,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Admin Potato",
                description="This is a Test Potato Type, not created by a user",
                user_created=False,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Tomato Type",
                description="This is a Test Tomato Type, created by a user",
                user_created=True,
                creator_id=2,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Artichoke Type",
                description="This is a Test Artichoke Type, created by a user",
                user_created=True,
                creator_id=2,
            )
        )
        test_plant_types.append(
            PlantType(
                name="Test Basil",
                description="This is a Test Basil Type",
                user_created=True,
                creator_id=3,
            )
        )
        for test_plant_type in test_plant_types:
            session.add(test_plant_type)
        await session.commit()
        break


async def add_plant_profiles():
    async for session in get_db():
        user_1 = await session.get(User, 1)
        user_2 = await session.get(User, 2)

        test_plant_profiles = []
        test_plant_profiles.append(
            PlantProfile(
                id=1,
                name="First Test Profile",
                description="Test Profile Description",
                public=True,
                grow_duration=10,
                user_created=True,
                plant_type_id=1,
                creator_id=1,
                users=[user_1, user_2],
            )
        )
        test_plant_profiles.append(
            PlantProfile(
                id=2,
                name="Private Test Profile",
                description="Admin's Private Test Profile Description",
                public=False,
                grow_duration=19,
                user_created=True,
                plant_type_id=1,
                creator_id=1,
                users=[user_1],
            )
        )
        test_plant_profiles.append(
            PlantProfile(
                id=3,
                name="User's Private Test Profile",
                description="Normal User's Private Test Profile Description",
                public=False,
                grow_duration=75,
                user_created=True,
                plant_type_id=1,
                creator_id=2,
                users=[user_2],
            )
        )
        for test_plant_profile in test_plant_profiles:
            session.add(test_plant_profile)
        await session.commit()
        break


async def add_plants():
    async for session in get_db():
        test_plants = []
        test_plants.append(
            Plant(
                name="My Precious Plant",
                device_id=1,
                plant_profile_id=1,
                plant_type_id=2,
                outdoor=True,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        test_plants.append(
            Plant(
                name="My Annoying Plant",
                device_id=1,
                plant_profile_id=2,
                plant_type_id=2,
                outdoor=False,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        test_plants.append(
            Plant(
                name="My Third Plant",
                device_id=2,
                plant_profile_id=2,
                plant_type_id=2,
                outdoor=True,
                latitude=53.8067,
                longitude=-1.5550,
            )
        )
        test_plants.append(
            Plant(
                name="We Need More Plants",
                device_id=2,
                plant_profile_id=2,
                plant_type_id=2,
                outdoor=False,
                latitude=23.8067,
                longitude=-19.5550,
            )
        )
        for test_plant in test_plants:
            session.add(test_plant)
        await session.commit()
        break
