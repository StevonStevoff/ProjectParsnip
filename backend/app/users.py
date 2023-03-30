import contextlib
from typing import Optional

from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_users import BaseUserManager, FastAPIUsers, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.exceptions import UserAlreadyExists, UserNotExists
from sqlalchemy import func, select

import app.settings as settings
from app.database import get_async_session, get_user_db
from app.models import User
from app.schemas import UserCreate

SECRET = settings.BACKEND_SECRET_KEY


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def create(
        self,
        user_create: UserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        matching_users = await self.user_db.session.execute(
            select(User).where(
                func.lower(User.username) == func.lower(user_create.username)
            )
        )
        existing_user = matching_users.scalars().first()

        if existing_user is not None:
            raise UserAlreadyExists()

        return await super().create(user_create, safe, request)

    async def authenticate(self, credentials: OAuth2PasswordRequestForm):
        try:
            user = await self.get_by_email(credentials.username)
        except UserNotExists:
            user_query = await self.user_db.session.execute(
                select(User).where(
                    func.lower(User.username) == func.lower(credentials.username)
                )
            )
            user = user_query.scalars().first()

            if user is None:
                # Run the hasher to mitigate timing attack
                # Inspired from Django: https://code.djangoproject.com/ticket/20760
                self.password_helper.hash(credentials.password)
                return None

        verified, updated_password_hash = self.password_helper.verify_and_update(
            credentials.password, user.hashed_password
        )
        if not verified:
            return None

        # Update password hash to a more robust one if needed
        if updated_password_hash is not None:
            await self.user_db.update(user, {"hashed_password": updated_password_hash})

        return user

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.username} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.username} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(
            f"Verification requested for user {user.username}. Verification token:"
            f" {token}"
        )


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


get_async_session_context = contextlib.asynccontextmanager(get_async_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(
    email: str, username: str, password: str, is_superuser: bool = False
):
    print("create_user called")
    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    user = await user_manager.create(
                        UserCreate(
                            email=email,
                            username=username,
                            password=password,
                            is_superuser=is_superuser,
                        )
                    )
                    print(f"User created {user.username}")
                    yield user
    except UserAlreadyExists:
        print(f"User {email} already exists")


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt", transport=bearer_transport, get_strategy=get_jwt_strategy
)

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
current_active_superuser = fastapi_users.current_user(active=True, superuser=True)
