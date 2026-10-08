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
npm run dev
```

Open **http://localhost:3000**. API base URL defaults to **http://localhost:8000**.

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
- Media files are placeholders; timestamps are aligned for demo seeking within clip length.

## Out of scope

- Real speech-to-text, meeting bots, Zoom/Meet/calendar/CRM integrations, team collaboration, production authentication.

## Testing

**Backend:**

```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. pytest
```

Covers health, meeting list filters, meeting CRUD, and action-item CRUD.

**Frontend smoke (manual):**

1. Open `/meetings` — six seeded meetings visible.
2. Search/filter by participant.
3. Open a meeting — play media, click transcript line to seek, active line highlights.
4. Summary tab — chapters, topics, add/complete/delete action item.
5. Create / edit / delete a meeting.

## Deployment

- Deploy **backend** (Railway/Render/Fly) with persistent volume for SQLite or re-seed on boot.
- Deploy **frontend** (Vercel) with `NEXT_PUBLIC_API_URL` pointing to the hosted API.
- Enable CORS on the API for your frontend origin.

## Screenshots / demo

Add screenshots to `docs/screenshots/` after running locally. Hosted demo URL: _(set when deployed)_.
