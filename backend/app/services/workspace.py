import json
from collections import Counter
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import ActionItem, Meeting, MeetingSummary
from app.schemas.workspace import (
    MeetingActivityPoint,
    TaskWithMeetingOut,
    TopicCount,
    WorkspaceStatsOut,
)


def list_all_tasks(db: Session, include_completed: bool = True) -> list[TaskWithMeetingOut]:
    stmt = (
        select(ActionItem, Meeting.title, Meeting.occurred_at)
        .join(Meeting, ActionItem.meeting_id == Meeting.id)
        .order_by(Meeting.occurred_at.desc(), ActionItem.sort_order, ActionItem.id)
    )
    if not include_completed:
        stmt = stmt.where(ActionItem.is_completed.is_(False))
    rows = db.execute(stmt).all()
    return [
        TaskWithMeetingOut(
            id=item.id,
            title=item.title,
            is_completed=item.is_completed,
            assignee=item.assignee,
            due_at=item.due_at,
            sort_order=item.sort_order,
            meeting_id=item.meeting_id,
            meeting_title=title,
            meeting_occurred_at=occurred_at,
        )
        for item, title, occurred_at in rows
    ]


def get_workspace_stats(db: Session) -> WorkspaceStatsOut:
    total_meetings = db.scalar(select(func.count()).select_from(Meeting)) or 0
    total_duration = db.scalar(select(func.coalesce(func.sum(Meeting.duration_ms), 0))) or 0

    total_items = db.scalar(select(func.count()).select_from(ActionItem)) or 0
    completed = (
        db.scalar(
            select(func.count()).select_from(ActionItem).where(ActionItem.is_completed.is_(True))
        )
        or 0
    )

    meetings = db.scalars(select(Meeting).order_by(Meeting.occurred_at)).all()
    month_counts: Counter[str] = Counter()
    for m in meetings:
        key = m.occurred_at.strftime("%Y-%m")
        month_counts[key] += 1
    meetings_by_month = [
        MeetingActivityPoint(month=k, count=v)
        for k, v in sorted(month_counts.items())
    ]

    summaries = db.scalars(select(MeetingSummary)).all()
    topic_counter: Counter[str] = Counter()
    for s in summaries:
        if not s.key_topics_json:
            continue
        try:
            topics = json.loads(s.key_topics_json)
        except json.JSONDecodeError:
            continue
        if isinstance(topics, list):
            for t in topics:
                if isinstance(t, str) and t.strip():
                    topic_counter[t.strip()] += 1

    top_topics = [
        TopicCount(topic=name, count=count)
        for name, count in topic_counter.most_common(8)
    ]

    return WorkspaceStatsOut(
        total_meetings=total_meetings,
        total_duration_ms=int(total_duration),
        total_action_items=total_items,
        completed_action_items=completed,
        open_action_items=total_items - completed,
        meetings_by_month=meetings_by_month,
        top_topics=top_topics,
    )
