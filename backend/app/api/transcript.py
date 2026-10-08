from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.meeting import TranscriptSegmentInput, TranscriptSegmentOut
from app.services import meetings as meeting_service

router = APIRouter(prefix="/meetings/{meeting_id}/transcript", tags=["transcript"])


@router.get("", response_model=list[TranscriptSegmentOut])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)) -> list[TranscriptSegmentOut]:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    segments = meeting_service.get_transcript(db, meeting_id)
    return [TranscriptSegmentOut.model_validate(s) for s in segments]


@router.put("", response_model=list[TranscriptSegmentOut])
def replace_transcript(
    meeting_id: int,
    segments: list[TranscriptSegmentInput],
    db: Session = Depends(get_db),
) -> list[TranscriptSegmentOut]:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    updated = meeting_service.replace_transcript(db, meeting_id, segments)
    return [TranscriptSegmentOut.model_validate(s) for s in updated]
