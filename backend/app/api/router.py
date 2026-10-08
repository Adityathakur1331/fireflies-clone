from fastapi import APIRouter

from app.api import action_items, meetings, summary, transcript, workspace

api_router = APIRouter(prefix="/api")
api_router.include_router(meetings.router)
api_router.include_router(transcript.router)
api_router.include_router(summary.router)
api_router.include_router(action_items.router)
api_router.include_router(workspace.router)
