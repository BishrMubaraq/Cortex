"""FastAPI application entrypoint.

Boilerplate backend for the AI Research Assistant. The ONLY real end-to-end
functionality is authentication (login -> protected route access). Everything
else is mock data used to prove the auth flow works.
"""

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth
from app.api.deps import get_current_user
from app.core.config import settings
from app.models.user import User

app = FastAPI(title=settings.APP_NAME, description=settings.API_DESCRIPTION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    """Liveness probe (no auth)."""
    return {"status": "ok"}


@app.get("/api/chats", tags=["chats"])
async def list_chats(current_user: User = Depends(get_current_user)) -> dict:
    """Return mock chats. Protected — proves the auth flow end to end."""
    return {
        "chats": [
            {
                "id": "chat_1",
                "title": "Q3 research summary",
                "updated_at": "2026-06-30T14:20:00Z",
                "message_count": 12,
            },
            {
                "id": "chat_2",
                "title": "Competitor landscape analysis",
                "updated_at": "2026-06-28T09:05:00Z",
                "message_count": 7,
            },
            {
                "id": "chat_3",
                "title": "Vector DB benchmarks",
                "updated_at": "2026-06-25T17:42:00Z",
                "message_count": 21,
            },
        ],
        "owner": current_user.username,
    }
