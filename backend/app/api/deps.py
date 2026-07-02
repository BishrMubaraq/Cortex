"""Shared API dependencies (auth guards)."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.core.security import decode_access_token
from app.models.user import User

# tokenUrl is used by the interactive docs "Authorize" button.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def _get_demo_user() -> User:
    """The single hardcoded user for this boilerplate (no database)."""
    return User(
        id=settings.DEMO_USER_ID,
        username=settings.DEMO_USERNAME,
        name=settings.DEMO_NAME,
    )


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Validate the bearer token and return the associated user.

    Raises 401 if the token is missing, invalid, expired, or references an
    unknown subject.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username = payload.get("sub")
    if username is None or username != settings.DEMO_USERNAME:
        raise credentials_exception

    return _get_demo_user()
