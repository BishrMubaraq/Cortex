"""Pydantic models for auth and user data."""

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., examples=["admin"])
    password: str = Field(..., examples=["password"])


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    id: str
    username: str
    name: str


class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
