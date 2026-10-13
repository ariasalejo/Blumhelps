# BlumHelps — connected platform foundation 0.3

## Components in this branch
- Android: existing Kotlin + Jetpack Compose APK, with its local habit/task planner preserved.
- PWA: React + TypeScript + Vite; PWA plugin generates the install manifest and service worker. The app shell can load offline; public-resource caching is limited to the non-personal resource catalog.
- Backend: FastAPI + SQLAlchemy, with public resource records in the database and a stateless explainable daily-step endpoint.
- Database: SQLite is the local-development default. Docker Compose uses PostgreSQL.
- Deployment packaging: `web/Dockerfile`, `backend/Dockerfile`, `web/nginx.conf`, `compose.platform.yml`.

## Local container stack
```bash
cp .env.compose.example .env
# Edit .env and set a strong local-only POSTGRES_PASSWORD
docker compose -f compose.platform.yml up --build
```
Open `http://localhost:8080`. The web server proxies `/api/` and `/health/` to FastAPI. The API service is kept on the private Docker network. For direct local API development, see below.

## Local development without Docker
Terminal 1:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
APP_BRAND=blumhelps uvicorn app.main:app --reload
``
Terminal 2:
```bash
cd web
npm install
npm run dev
``
The Vite server proxies `/api` to `http://127.0.0.1:8000`. API docs are available at `http://127.0.0.1:8000/docs`.

## Privacy model
Habits, personal history and selected goals stay in the device/browser in this increment. The planning API receives only the user's current energy, time, focus and language choices and is stateless. No recovery journal or profile is uploaded. Account sync is intentionally not enabled yet: before enabling it, implement and test opt-in consent, authentication, per-user authorization, export/deletion, retention and incident handling.

## Product and safety limits
The planner uses transparent rules, not a clinical prediction model. The app does not diagnose, promise recovery, guarantee care or benefits, or operate an emergency service. Public-resource catalog entries must be reviewed by a person before release; a review date is not proof that a service is currently available. Do not publish this development stack to the internet until HTTPS, unique production secrets, strict CORS, database backups/migrations and production logging controls are configured.
