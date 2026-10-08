import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import MeetingSummary
from app.schemas.meeting import SummaryChapterOut, SummaryResponse, SummaryUpdate
from app.services import meetings as meeting_service

router = APIRouter(prefix="/meetings/{meeting_id}/summary", tags=["summary"])


@router.get("", response_model=SummaryResponse)
def get_summary(meeting_id: int, db: Session = Depends(get_db)) -> SummaryResponse:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    summary = meeting_service.get_summary(db, meeting_id)
    chapters = meeting_service.get_chapters(db, meeting_id)
    topics: list[str] = []
    if summary and summary.key_topics_json:
        try:
            topics = json.loads(summary.key_topics_json)
        except json.JSONDecodeError:
            topics = []
    return SummaryResponse(
        overview=summary.overview if summary else None,
        gist=summary.gist if summary else None,
        key_topics=topics,
        chapters=[SummaryChapterOut.model_validate(c) for c in chapters],
    )


@router.put("", response_model=SummaryResponse)
def update_summary(
    meeting_id: int, data: SummaryUpdate, db: Session = Depends(get_db)
) -> SummaryResponse:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    summary = meeting_service.get_summary(db, meeting_id)
    if not summary:
        summary = MeetingSummary(meeting_id=meeting_id)
        db.add(summary)
    if data.overview is not None:
        summary.overview = data.overview
    if data.gist is not None:
        summary.gist = data.gist
    if data.key_topics is not None:
        summary.key_topics_json = json.dumps(data.key_topics)
    db.commit()
    return get_summary(meeting_id, db)
