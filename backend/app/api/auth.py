"""Authentication routes: /auth/login and /auth/me."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.models.user import LoginRequest, Token, User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest) -> Token:
    """Validate hardcoded credentials and return a JWT access token."""
    valid_username = payload.username == settings.DEMO_USERNAME
    valid_password = verify_password(payload.password, settings.DEMO_PASSWORD_HASH)

    if not (valid_username and valid_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(subject=settings.DEMO_USERNAME)
    return Token(access_token=access_token)


@router.get("/me", response_model=User)
async def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    """Return the authenticated user's profile (protected)."""
    return current_user
