"""Plain streaming chat endpoint.

Proves the full loop: frontend -> backend -> LLM API -> streamed response.
No RAG, no vector DB, no agents. The conversation history is sent on every
request so this stays stateless (no database).

Streaming uses Server-Sent Events (SSE). Each token is emitted as a frame:

    data: {"delta": "..."}\n\n

Errors are surfaced in-band (so the client can render a partial answer):

    data: {"error": "..."}\n\n

The stream always terminates with a sentinel:

    data: [DONE]\n\n
"""

import json
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.api.deps import get_current_user
from app.core.config import settings
from app.models.chat import ChatRequest, ChatTurn
from app.models.user import User

router = APIRouter(prefix="/api", tags=["chat"])


class ChatError(Exception):
    """Raised when a request can't be served (bad model, missing key, etc.)."""


def _resolve_model(model_id: str) -> tuple[str, str]:
    """Map a UI model id to (provider, concrete_model_name)."""
    if model_id == "claude":
        return "anthropic", settings.ANTHROPIC_MODEL
    if model_id in ("gpt-4", "gpt", "gpt-4o"):
        return "openai", settings.OPENAI_MODEL
    if model_id == "llama-3-local":
        raise ChatError(
            "Local Llama 3 isn't wired up yet — pick Claude or GPT-4 for now."
        )
    raise ChatError(f"Unknown model '{model_id}'.")


async def _stream_anthropic(
    model: str, messages: list[ChatTurn]
) -> AsyncIterator[str]:
    if not settings.ANTHROPIC_API_KEY:
        raise ChatError("ANTHROPIC_API_KEY is not set on the server.")

    from anthropic import AsyncAnthropic

    client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    async with client.messages.stream(
        model=model,
        max_tokens=settings.LLM_MAX_TOKENS,
        system=settings.LLM_SYSTEM_PROMPT,
        messages=[{"role": m.role, "content": m.content} for m in messages],
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def _stream_openai(
    model: str, messages: list[ChatTurn]
) -> AsyncIterator[str]:
    if not settings.OPENAI_API_KEY:
        raise ChatError("OPENAI_API_KEY is not set on the server.")

    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    stream = await client.chat.completions.create(
        model=model,
        max_tokens=settings.LLM_MAX_TOKENS,
        stream=True,
        messages=[
            {"role": "system", "content": settings.LLM_SYSTEM_PROMPT},
            *({"role": m.role, "content": m.content} for m in messages),
        ],
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content if chunk.choices else None
        if delta:
            yield delta


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


async def _event_stream(req: ChatRequest) -> AsyncIterator[str]:
    """Yield SSE frames for the given chat request."""
    try:
        provider, model = _resolve_model(req.model)
        producer = (
            _stream_anthropic if provider == "anthropic" else _stream_openai
        )
        async for delta in producer(model, req.messages):
            yield _sse({"delta": delta})
    except ChatError as exc:
        yield _sse({"error": str(exc)})
    except Exception as exc:  # noqa: BLE001 - surface any provider error in-band
        yield _sse({"error": f"Upstream model error: {exc}"})
    finally:
        yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(
    req: ChatRequest,
    _user: User = Depends(get_current_user),
) -> StreamingResponse:
    """Stream a plain LLM completion back to the client as SSE."""
    return StreamingResponse(
        _event_stream(req),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            # Disable proxy buffering (e.g. nginx) so tokens flush immediately.
            "X-Accel-Buffering": "no",
        },
    )
