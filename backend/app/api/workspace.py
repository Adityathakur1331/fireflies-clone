from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.workspace import TaskWithMeetingOut, WorkspaceStatsOut
from app.services import workspace as workspace_service

router = APIRouter(tags=["workspace"])


@router.get("/tasks", response_model=list[TaskWithMeetingOut])
def list_tasks(
    include_completed: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> list[TaskWithMeetingOut]:
    return workspace_service.list_all_tasks(db, include_completed=include_completed)


@router.get("/workspace/stats", response_model=WorkspaceStatsOut)
def workspace_stats(db: Session = Depends(get_db)) -> WorkspaceStatsOut:
    return workspace_service.get_workspace_stats(db)
