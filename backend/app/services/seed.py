import json
from datetime import datetime

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models import (
    ActionItem,
    Meeting,
    MeetingParticipant,
    MeetingSummary,
    SummaryChapter,
    TranscriptSegment,
)
from app.seed.meetings_data import MEETING_DEFINITIONS


def run_seed(db: Session) -> None:
    db.execute(delete(ActionItem))
    db.execute(delete(SummaryChapter))
    db.execute(delete(TranscriptSegment))
    db.execute(delete(MeetingSummary))
    db.execute(delete(MeetingParticipant))
    db.execute(delete(Meeting))
    db.commit()

    for defn in MEETING_DEFINITIONS:
        meeting = Meeting(
            id=defn["id"],
            title=defn["title"],
            occurred_at=datetime.fromisoformat(defn["occurred_at"]),
            duration_ms=defn["duration_ms"],
            media_url=defn.get("media_url"),
            media_type=defn.get("media_type", "audio"),
            description=defn.get("description"),
        )
        db.add(meeting)
        db.flush()

        for i, p in enumerate(defn["participants"]):
            db.add(
                MeetingParticipant(
                    meeting_id=meeting.id,
                    display_name=p["display_name"],
                    email=p.get("email"),
                    sort_order=i,
                )
            )

        for seg in defn["segments"]:
            db.add(
                TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker_label=seg["speaker_label"],
                    start_ms=seg["start_ms"],
                    end_ms=seg["end_ms"],
                    content=seg["content"],
                    sequence=seg["sequence"],
                )
            )

        summary_data = defn["summary"]
        db.add(
            MeetingSummary(
                meeting_id=meeting.id,
                overview=summary_data["overview"],
                gist=summary_data["gist"],
                key_topics_json=json.dumps(summary_data["key_topics"]),
            )
        )

        for i, ch in enumerate(defn["chapters"]):
            db.add(
                SummaryChapter(
                    meeting_id=meeting.id,
                    title=ch["title"],
                    start_ms=ch["start_ms"],
                    sort_order=i,
                )
            )

        for i, item in enumerate(defn["action_items"]):
            db.add(
                ActionItem(
                    meeting_id=meeting.id,
                    title=item["title"],
                    assignee=item.get("assignee"),
                    is_completed=item.get("is_completed", False),
                    sort_order=i,
                )
            )

    db.commit()
