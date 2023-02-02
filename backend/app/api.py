from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import User, create_db_and_tables
from app.router import devices, plant_profiles, plant_types, plants, sensors, users
from app.schemas import UserCreate, UserRead
from app.users import auth_backend, current_active_user, fastapi_users

description = """
ProjectParsnip API services the frontend project available at _(url to frontend)_
 and interfaces with the hardware devices
"""

app = FastAPI(title="ProjectParsnip", description=description, version="0.0.1")

# === FastAPI Users Routes ===
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"]
)
app.include_router(
    fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"]
)

# === Project Parsnip Routes ===
app.include_router(devices.router, prefix="/devices", tags=["devices"])
app.include_router(sensors.router, prefix="/sensors", tags=["sensors"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(plant_types.router, prefix="/plant_types", tags=["plant_types"])
app.include_router(
    plant_profiles.router, prefix="/plant_profiles", tags=["plant_profiles"]
)
app.include_router(plants.router, prefix="/plants", tags=["plants"])

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.username}!"}


@app.on_event("startup")
async def on_startup():
    # Not needed if you setup a migration system like Alembic
    await create_db_and_tables()
