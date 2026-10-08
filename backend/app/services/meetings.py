import json
from datetime import datetime

from sqlalchemy import distinct, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models import (
    ActionItem,
    Meeting,
    MeetingParticipant,
    MeetingSummary,
    SummaryChapter,
    TranscriptSegment,
)
from app.schemas.meeting import (
    MeetingCreate,
    MeetingDetail,
    MeetingListItem,
    MeetingUpdate,
    ParticipantOut,
    TranscriptSegmentInput,
)
from app.services.transcript_parser import parse_transcript_raw


def _meeting_to_list_item(meeting: Meeting) -> MeetingListItem:
    names = sorted({p.display_name for p in meeting.participants})
    return MeetingListItem(
        id=meeting.id,
        title=meeting.title,
        occurred_at=meeting.occurred_at,
        duration_ms=meeting.duration_ms,
        participants=names,
    )


def list_meetings(
    db: Session,
    q: str | None,
    participant: str | None,
    date_from: datetime | None,
    date_to: datetime | None,
    sort: str,
    limit: int,
    offset: int,
) -> tuple[list[MeetingListItem], int]:
    stmt = select(Meeting).options(joinedload(Meeting.participants))
    count_stmt = select(func.count(distinct(Meeting.id))).select_from(Meeting)

    if q or participant:
        stmt = stmt.join(MeetingParticipant, MeetingParticipant.meeting_id == Meeting.id)
        count_stmt = count_stmt.join(
            MeetingParticipant, MeetingParticipant.meeting_id == Meeting.id
        )

    filters = []
    if q:
        pattern = f"%{q}%"
        filters.append(
            or_(Meeting.title.ilike(pattern), MeetingParticipant.display_name.ilike(pattern))
        )
    if participant:
        filters.append(MeetingParticipant.display_name.ilike(f"%{participant}%"))
    if date_from:
        filters.append(Meeting.occurred_at >= date_from)
    if date_to:
        filters.append(Meeting.occurred_at <= date_to)

    for f in filters:
        stmt = stmt.where(f)
        count_stmt = count_stmt.where(f)

    if sort == "occurred_at_asc":
        stmt = stmt.order_by(Meeting.occurred_at.asc())
    else:
        stmt = stmt.order_by(Meeting.occurred_at.desc())

    stmt = stmt.distinct().offset(offset).limit(limit)
    meetings = db.scalars(stmt).unique().all()
    total = db.scalar(count_stmt) or 0
    return [_meeting_to_list_item(m) for m in meetings], total


def get_meeting_detail(db: Session, meeting_id: int) -> MeetingDetail | None:
    meeting = db.scalar(
        select(Meeting)
        .options(joinedload(Meeting.participants), joinedload(Meeting.summary))
        .where(Meeting.id == meeting_id)
    )
    if not meeting:
        return None
    gist = meeting.summary.gist if meeting.summary else None
    return MeetingDetail(
        id=meeting.id,
        title=meeting.title,
        occurred_at=meeting.occurred_at,
        duration_ms=meeting.duration_ms,
        media_url=meeting.media_url,
        media_type=meeting.media_type,
        description=meeting.description,
        participants=[
            ParticipantOut.model_validate(p)
            for p in sorted(meeting.participants, key=lambda x: x.sort_order)
        ],
        summary_gist=gist,
    )


def _insert_segments(
    db: Session, meeting_id: int, segments: list[TranscriptSegmentInput]
) -> int:
    duration_ms = 0
    for idx, seg in enumerate(segments):
        db.add(
            TranscriptSegment(
                meeting_id=meeting_id,
                speaker_label=seg.speaker_label,
                start_ms=seg.start_ms,
                end_ms=seg.end_ms,
                content=seg.content,
                sequence=idx,
            )
        )
        duration_ms = max(duration_ms, seg.end_ms)
    return duration_ms


def _default_summary_from_segments(segments: list[TranscriptSegmentInput]) -> MeetingSummary:
    preview = " ".join(s.content for s in segments[:3])[:400]
    return MeetingSummary(
        overview=f"This meeting covered key discussion points including: {preview}...",
        gist="Collaborative working session with decisions and follow-ups.",
        key_topics_json=json.dumps(["Planning", "Decisions", "Follow-ups"]),
    )


def create_meeting(db: Session, data: MeetingCreate) -> Meeting:
    segments: list[TranscriptSegmentInput] = []
    if data.transcript_raw:
        segments = parse_transcript_raw(data.transcript_raw)
    elif data.transcript_segments:
        segments = data.transcript_segments

    meeting = Meeting(
        title=data.title,
        occurred_at=data.occurred_at,
        duration_ms=0,
        media_url=data.media_url,
        media_type=data.media_type,
        description=data.description,
    )
    db.add(meeting)
    db.flush()

    for i, p in enumerate(data.participants):
        db.add(
            MeetingParticipant(
                meeting_id=meeting.id,
                display_name=p.display_name,
                email=p.email,
                sort_order=i,
            )
        )

    if segments:
        meeting.duration_ms = _insert_segments(db, meeting.id, segments)
        summary = _default_summary_from_segments(segments)
        summary.meeting_id = meeting.id
        db.add(summary)
    else:
        meeting.duration_ms = 60000
        db.add(
            MeetingSummary(
                meeting_id=meeting.id,
                overview="New meeting — add a transcript to generate richer notes.",
                gist="Meeting created without transcript.",
                key_topics_json=json.dumps(["General discussion"]),
            )
        )

    db.commit()
    db.refresh(meeting)
    return meeting


def update_meeting(db: Session, meeting_id: int, data: MeetingUpdate) -> Meeting | None:
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        return None
    if data.title is not None:
        meeting.title = data.title
    if data.occurred_at is not None:
        meeting.occurred_at = data.occurred_at
    if data.description is not None:
        meeting.description = data.description
    if data.media_url is not None:
        meeting.media_url = data.media_url
    if data.media_type is not None:
        meeting.media_type = data.media_type
    if data.participants is not None:
        meeting.participants.clear()
        db.flush()
        for i, p in enumerate(data.participants):
            db.add(
                MeetingParticipant(
                    meeting_id=meeting.id,
                    display_name=p.display_name,
                    email=p.email,
                    sort_order=i,
                )
            )
    meeting.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting


def delete_meeting(db: Session, meeting_id: int) -> bool:
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        return False
    db.delete(meeting)
    db.commit()
    return True


def get_transcript(db: Session, meeting_id: int) -> list[TranscriptSegment]:
    return list(
        db.scalars(
            select(TranscriptSegment)
            .where(TranscriptSegment.meeting_id == meeting_id)
            .order_by(TranscriptSegment.sequence)
        ).all()
    )


def replace_transcript(
    db: Session, meeting_id: int, segments: list[TranscriptSegmentInput]
) -> list[TranscriptSegment]:
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        return []
    from sqlalchemy import delete as sql_delete

    db.execute(sql_delete(TranscriptSegment).where(TranscriptSegment.meeting_id == meeting_id))
    meeting.duration_ms = _insert_segments(db, meeting_id, segments)
    db.commit()
    return get_transcript(db, meeting_id)


def get_summary(db: Session, meeting_id: int) -> MeetingSummary | None:
    return db.get(MeetingSummary, meeting_id)


def get_chapters(db: Session, meeting_id: int) -> list[SummaryChapter]:
    return list(
        db.scalars(
            select(SummaryChapter)
            .where(SummaryChapter.meeting_id == meeting_id)
            .order_by(SummaryChapter.sort_order)
        ).all()
    )


def get_action_items(db: Session, meeting_id: int) -> list[ActionItem]:
    return list(
        db.scalars(
            select(ActionItem)
            .where(ActionItem.meeting_id == meeting_id)
            .order_by(ActionItem.sort_order, ActionItem.id)
        ).all()
    )
