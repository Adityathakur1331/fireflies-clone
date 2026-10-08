# Northstar Notes — Fireflies Clone (SDE Assignment)

A full-stack meeting-assistant workspace inspired by Fireflies.ai. Browse past meetings, read interactive transcripts synced to sample media, review AI-style summaries, and manage action items. Speech-to-text and real authentication are intentionally mocked.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, TanStack Query, Radix UI primitives |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, Pydantic |
| Database | SQLite |
| Migrations | Alembic (`001_initial_schema`) |

## Architecture

```
Browser (localhost:3000)
    → REST JSON → FastAPI (localhost:8000)
                        → SQLAlchemy → SQLite (backend/data/fireflies.db)
```

- **Frontend**: App Router pages under `frontend/src/app`, API wrappers in `frontend/src/lib/api`, feature components under `frontend/src/components`.
- **Backend**: Thin routers in `backend/app/api`, business logic in `backend/app/services`, ORM models in `backend/app/models`.

## Folder structure

```
backend/          FastAPI app, Alembic, tests, seed data
frontend/         Next.js UI and public sample media
CHECKLIST.md      M1–M25 requirement verification
```

## Database schema

| Table | Purpose |
|-------|---------|
| `meetings` | Title, date, duration, media URL/type |
| `meeting_participants` | Attendees per meeting |
| `transcript_segments` | Speaker-labeled lines with start/end ms |
| `meeting_summaries` | Overview, gist, key topics (JSON) |
| `summary_chapters` | Chapter titles with seek timestamps |
| `action_items` | Tasks with assignee and completion |

Relationships: all child tables reference `meetings.id` with `ON DELETE CASCADE`.

| Child table | FK | On delete |
|-------------|-----|-----------|
| `meeting_participants` | `meeting_id` | CASCADE |
| `transcript_segments` | `meeting_id` | CASCADE |
| `meeting_summaries` | `meeting_id` (PK) | CASCADE |
| `summary_chapters` | `meeting_id` | CASCADE |
| `action_items` | `meeting_id` | CASCADE |

See migration: [`backend/alembic/versions/001_initial_schema.py`](backend/alembic/versions/001_initial_schema.py).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/meetings` | List/search/filter/sort meetings |
| POST | `/api/meetings` | Create meeting (optional transcript paste) |
| GET | `/api/meetings/{id}` | Meeting detail |
| PATCH | `/api/meetings/{id}` | Update metadata |
| DELETE | `/api/meetings/{id}` | Delete meeting |
| GET | `/api/meetings/{id}/transcript` | Transcript segments |
| PUT | `/api/meetings/{id}/transcript` | Replace transcript |
| GET | `/api/meetings/{id}/summary` | Summary, topics, chapters |
| PUT | `/api/meetings/{id}/summary` | Update summary |
| GET/POST | `/api/meetings/{id}/action-items` | List/create tasks |
| PATCH/DELETE | `/api/meetings/{id}/action-items/{item_id}` | Update/delete task |
| POST | `/api/admin/seed` | Re-seed database (dev/demo) |

## Setup instructions

### Prerequisites

- Node.js 20+
- Python 3.12+

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
PYTHONPATH=. python -m app.seed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev -- --port 3000 --hostname 0.0.0.0
```

Open **http://localhost:3000**. API base URL defaults to **http://localhost:8000** (`NEXT_PUBLIC_API_URL`).

### Quick verify (both servers running)

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/meetings
open http://localhost:3000/meetings   # or visit in browser
```

## Environment variables

| Variable | Location | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | `http://localhost:8000` |
| `DATABASE_URL` | `backend/.env` | `sqlite:///data/fireflies.db` |
| `CORS_ORIGINS` | `backend/.env` | `http://localhost:3000` |
| `DEV_BOOTSTRAP` | `backend/.env` | `0` (set `1` only for optional `create_all` fallback) |

## Seed instructions

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
PYTHONPATH=. python -m app.seed
```

Loads **6 realistic meetings** with multi-speaker transcripts (~20–25 segments each), summaries, chapters, and action items. Sample media: `frontend/public/media/sample-meeting.mp3` (and `.mp4` for one meeting).

HTTP alternative: `POST http://localhost:8000/api/admin/seed`

## Assumptions

- Single implicit demo user (no auth).
- Summaries are seeded/mock content, not live LLM output.
- Transcript paste format: `[HH:MM:SS] Speaker: text` per line.
- Media files are placeholders (`sample-meeting.mp3` / `.mp4`, ~4:15 each); seed transcript timestamps end at or before 4:10 so seek/highlight stays within playable range.

## Out of scope

- Real speech-to-text, meeting bots, Zoom/Meet/calendar/CRM integrations, team collaboration, production authentication.

## Testing

### Backend (pytest)

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. pytest -v
```

With coverage report:

```bash
PYTHONPATH=. pytest --cov=app --cov-report=term-missing
```

**Automated coverage areas:**

| Area | Test module |
|------|-------------|
| Health | `tests/test_health.py` |
| Meetings list / search / participant / date / sort | `tests/test_meetings_list.py` |
| Meetings CRUD | `tests/test_meetings_crud.py` |
| Action items list + CRUD | `tests/test_action_items.py` |
| Transcript + summary payloads | `tests/test_transcript_summary.py` |

### Frontend (build + smoke)

```bash
cd frontend
npm install
npm run lint
API_URL=http://localhost:8000 npm run test:smoke
```

`test:smoke` runs `next build` and optionally hits `/api/health` and `/api/meetings` when `API_URL` is set (backend must be running).

**Note:** Stop `next dev` before running `test:smoke` / `next build`, or restart dev afterward (`rm -rf .next && npm run dev`). A production build while dev is running can leave `/_next/static/*` returning 404 (unstyled page, stuck loading).

### Manual workflow smoke (before submission)

1. Open `/meetings` — six seeded meetings visible.
2. Search/filter by participant and date; clear filters.
3. Open a meeting — play media, click transcript line to seek, active line highlights.
4. Summary tab — chapters, topics, add/edit/complete/delete action item; refresh to confirm persistence.
5. Create / edit / delete a meeting — confirm success/error toasts.
6. Narrow viewport (~375px) — mobile Meetings/Settings nav visible.

Requirement traceability: [`CHECKLIST.md`](CHECKLIST.md). Audit notes: [`docs/SUBMISSION_AUDIT.md`](docs/SUBMISSION_AUDIT.md).

## Deployment

### Backend (example: Render / Railway)

1. Set root to `backend`, start command:  
   `alembic upgrade head && PYTHONPATH=. python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Env: `DATABASE_URL` (persistent disk path if available), `CORS_ORIGINS=https://your-frontend.vercel.app`
3. Note: ephemeral disks lose SQLite on redeploy unless you use a volume or re-seed on boot.

### Frontend (example: Vercel)

1. Root directory: `frontend`
2. Env: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
3. Build command: `npm run build` — output: Next.js default

### Local production smoke

```bash
cd frontend && npm run build && npm run start -- -p 3000
```

## Preparing GitHub for submission

1. Create a **public** repository on GitHub.
2. Push this project: `git remote add origin <url>` then `git push -u origin main`.
3. Add a short **repository description** and link to hosted demo in README when ready.
4. Optional: add screenshots under `docs/screenshots/` and reference them in README.
5. Verify clone-from-scratch: follow Setup instructions on a clean machine.

## Screenshots / demo

Add screenshots to `docs/screenshots/` after running locally. Set your hosted demo URL in README:

`Live demo: https://...`
