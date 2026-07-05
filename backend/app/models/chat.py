"""Pydantic models for the streaming chat endpoint."""

from typing import Literal

from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    """A single message in the conversation history."""

    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Request body for POST /api/chat.

    The full conversation history is sent every time so the backend stays
    stateless (no database yet). `model` matches the UI dropdown id.
    """

    messages: list[ChatTurn] = Field(..., min_length=1)
    model: str = "claude"
