from datetime import datetime

from pydantic import BaseModel


class TaskWithMeetingOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    assignee: str | None
    due_at: datetime | None
    sort_order: int
    meeting_id: int
    meeting_title: str
    meeting_occurred_at: datetime

    model_config = {"from_attributes": True}


class MeetingActivityPoint(BaseModel):
    month: str
    count: int


class TopicCount(BaseModel):
    topic: str
    count: int


class WorkspaceStatsOut(BaseModel):
    total_meetings: int
    total_duration_ms: int
    total_action_items: int
    completed_action_items: int
    open_action_items: int
    meetings_by_month: list[MeetingActivityPoint]
    top_topics: list[TopicCount]
