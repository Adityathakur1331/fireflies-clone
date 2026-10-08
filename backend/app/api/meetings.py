from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.meeting import (
    MeetingCreate,
    MeetingDetail,
    MeetingListItem,
    MeetingUpdate,
    PaginatedMeetings,
)
from app.services import meetings as meeting_service

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=PaginatedMeetings)
def list_meetings(
    q: str | None = None,
    participant: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    sort: str = Query(default="occurred_at_desc"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> PaginatedMeetings:
    items, total = meeting_service.list_meetings(
        db, q, participant, date_from, date_to, sort, limit, offset
    )
    return PaginatedMeetings(items=items, total=total)


@router.post("", response_model=MeetingDetail, status_code=201)
def create_meeting(data: MeetingCreate, db: Session = Depends(get_db)) -> MeetingDetail:
    try:
        meeting = meeting_service.create_meeting(db, data)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    detail = meeting_service.get_meeting_detail(db, meeting.id)
    assert detail is not None
    return detail


@router.get("/{meeting_id}", response_model=MeetingDetail)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)) -> MeetingDetail:
    detail = meeting_service.get_meeting_detail(db, meeting_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return detail


@router.patch("/{meeting_id}", response_model=MeetingDetail)
def update_meeting(
    meeting_id: int, data: MeetingUpdate, db: Session = Depends(get_db)
) -> MeetingDetail:
    meeting = meeting_service.update_meeting(db, meeting_id, data)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    detail = meeting_service.get_meeting_detail(db, meeting_id)
    assert detail is not None
    return detail


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)) -> None:
    if not meeting_service.delete_meeting(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
