from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import User
from app.router import (
    authentication,
    devices,
    grow_properties,
    grow_property_types,
    notifications,
    plant_data,
    plant_profiles,
    plant_types,
    plants,
    sensors,
    users,
)
from app.schemas import UserCreate, UserRead
from app.users import auth_backend, current_active_user, fastapi_users

description = """
ProjectParsnip API services the frontend project available at _(url to frontend)_
 and interfaces with the hardware devices
"""

app = FastAPI(title="ProjectParsnip", description=description, version="0.0.1")

# === FastAPI Users Routes ===
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
# This route was created by project, placed here for ordering in swagger docs
app.include_router(
    authentication.router,
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

# === Project Parsnip Routes ===
app.include_router(
    devices.router,
    prefix="/devices",
    tags=["devices"],
)
app.include_router(
    grow_properties.router,
    prefix="/grow_properties",
    tags=["grow_properties"],
)
app.include_router(
    grow_property_types.router,
    prefix="/grow_property_types",
    tags=["grow_property_types"],
)
app.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["notifications"],
)
app.include_router(
    plants.router,
    prefix="/plants",
    tags=["plants"],
)
app.include_router(
    plant_data.router,
    prefix="/plant_data",
    tags=["plant_data"],
)
app.include_router(
    plant_profiles.router,
    prefix="/plant_profiles",
    tags=["plant_profiles"],
)
app.include_router(
    plant_types.router,
    prefix="/plant_types",
    tags=["plant_types"],
)
app.include_router(
    sensors.router,
    prefix="/sensors",
    tags=["sensors"],
)
app.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
)


origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:19006",
    "http://localhost:19000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello react native"}


@app.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.username}!"}


@app.on_event("startup")
async def on_startup():
    pass
