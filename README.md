# AI Research Assistant — Boilerplate

A monorepo boilerplate for an AI research/docs assistant.

- **`frontend/`** — React + Vite + TypeScript, Tailwind CSS, shadcn/ui, lucide-react
- **`backend/`** — FastAPI + Uvicorn + Pydantic, JWT auth (python-jose), password hashing (passlib)

> **Scope:** The ONLY real end-to-end functionality is **login → protected route access**.
> Everything else (Chat, Knowledge Base, Agents, Prompt Playground, Settings) is **UI-only
> with mock data** — no real LLM, RAG, vector DB, or agent logic. Wire those up later.

## Architecture at a glance

```
Login form ──POST /auth/login──▶ FastAPI validates hardcoded creds ──▶ returns JWT
   │                                                                      │
   └── JWT stored in React context (IN MEMORY, not localStorage) ─────────┘
                              │
App shell mount ──GET /auth/me (Bearer token)──▶ user profile ──▶ render avatar/name
                              │
                     Logout ──▶ clears token from state ──▶ redirect to /login
```

The frontend `lib/api.ts` wrapper attaches the in-memory JWT to the `Authorization`
header and is used **only** by the auth calls. All other screens use local/mock state.

## Ports

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:8000   |
| API docs | http://localhost:8000/docs |

## Demo credentials

```
username: admin
password: password
```

---

## 1. Backend — FastAPI

Requires Python 3.11+.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Optional: customize secrets/credentials (defaults work out of the box)
cp .env.example .env

# Run the API (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### Endpoints

| Method | Path          | Auth | Description                              |
| ------ | ------------- | ---- | ---------------------------------------- |
| GET    | `/health`     | —    | Liveness probe → `{"status": "ok"}`      |
| POST   | `/auth/login` | —    | Validate creds → returns JWT (401 on bad)|
| GET    | `/auth/me`    | ✅   | Current user profile                     |
| GET    | `/api/chats`  | ✅   | Mock chats (proves auth flow end to end) |

### Changing the demo password

The password is stored **hashed** (never plaintext) in `app/core/config.py`
(overridable via `.env`). Generate a new hash:

```bash
source .venv/bin/activate
python -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('yourpassword'))"
```

Put the result in `.env` as `DEMO_PASSWORD_HASH=...`.

---

## 2. Frontend — React + Vite

Requires Node 18+.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build
npm run preview    # preview the production build
```

The API base URL defaults to `http://localhost:8000`. To override, create
`frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

### Notes

- **Dark mode is the default**; toggle light mode from the top bar or Settings.
- The JWT lives in React context **in memory only** — a full page reload requires
  signing in again (by design; no `localStorage` for the token).

---

## 3. Example curl commands

Assuming the backend is running on `:8000`.

**Health (no auth):**

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

**Login (bad credentials → 401):**

```bash
curl -i -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
# HTTP/1.1 401 Unauthorized
```

**Login (valid → JWT):**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
# {"access_token":"<JWT>","token_type":"bearer"}
```

**Use the token on a protected route:**

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl http://localhost:8000/auth/me      -H "Authorization: Bearer $TOKEN"
curl http://localhost:8000/api/chats    -H "Authorization: Bearer $TOKEN"
```

**Protected route without a token → 401:**

```bash
curl -i http://localhost:8000/auth/me
# HTTP/1.1 401 Unauthorized
```

---

## Project structure

```
.
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py            # app + CORS + /health + /api/chats
│       ├── core/
│       │   ├── config.py      # settings, secret key, token expiry, demo user
│       │   └── security.py    # password hashing, JWT create/verify
│       ├── api/
│       │   ├── auth.py        # /auth/login, /auth/me
│       │   └── deps.py        # get_current_user dependency
│       └── models/
│           └── user.py        # Pydantic models
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.tsx           # providers: Theme, Router, Auth, Tooltip
        ├── App.tsx            # public /login vs. protected app shell
        ├── lib/
        │   ├── api.ts         # typed fetch wrapper (attaches JWT)
        │   └── utils.ts       # cn() helper
        ├── context/           # AuthContext, ThemeContext
        ├── router/            # minimal history-based router
        ├── data/mock.ts       # static mock data for UI screens
        └── components/
            ├── ui/            # shadcn/ui primitives
            ├── auth/          # LoginForm, ProtectedRoute
            ├── layout/        # AppShell, TopBar
            ├── sidebar/       # Sidebar
            ├── chat/          # ChatView + subcomponents
            ├── knowledge-base/
            ├── agents/
            ├── playground/
            └── settings/
```

## What's intentionally NOT here

- No database (auth is hardcoded/in-memory only)
- No LLM, RAG, vector DB, or agent logic
- No state management library (React `useState`/`useContext` only)
- No `localStorage` for the JWT (kept in memory)
