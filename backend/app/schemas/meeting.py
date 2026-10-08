from datetime import datetime

from pydantic import BaseModel, Field


class ParticipantInput(BaseModel):
    display_name: str
    email: str | None = None


class ParticipantOut(BaseModel):
    id: int
    display_name: str
    email: str | None = None

    model_config = {"from_attributes": True}


class TranscriptSegmentInput(BaseModel):
    speaker_label: str
    start_ms: int
    end_ms: int
    content: str


class TranscriptSegmentOut(BaseModel):
    id: int
    speaker_label: str
    start_ms: int
    end_ms: int
    content: str
    sequence: int

    model_config = {"from_attributes": True}


class MeetingListItem(BaseModel):
    id: int
    title: str
    occurred_at: datetime
    duration_ms: int
    participants: list[str]

    model_config = {"from_attributes": True}


class MeetingDetail(BaseModel):
    id: int
    title: str
    occurred_at: datetime
    duration_ms: int
    media_url: str | None
    media_type: str | None
    description: str | None
    participants: list[ParticipantOut]
    summary_gist: str | None = None

    model_config = {"from_attributes": True}


class PaginatedMeetings(BaseModel):
    items: list[MeetingListItem]
    total: int


class MeetingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    occurred_at: datetime
    participants: list[ParticipantInput] = Field(default_factory=list)
    media_type: str = "audio"
    media_url: str | None = "/media/sample-meeting.mp3"
    description: str | None = None
    transcript_segments: list[TranscriptSegmentInput] | None = None
    transcript_raw: str | None = None


class MeetingUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
    occurred_at: datetime | None = None
    participants: list[ParticipantInput] | None = None
    description: str | None = None
    media_url: str | None = None
    media_type: str | None = None


class SummaryChapterOut(BaseModel):
    id: int
    title: str
    start_ms: int
    sort_order: int

    model_config = {"from_attributes": True}


class SummaryResponse(BaseModel):
    overview: str | None
    gist: str | None
    key_topics: list[str]
    chapters: list[SummaryChapterOut]


class SummaryUpdate(BaseModel):
    overview: str | None = None
    gist: str | None = None
    key_topics: list[str] | None = None


class ActionItemOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    assignee: str | None
    due_at: datetime | None
    sort_order: int

    model_config = {"from_attributes": True}


class ActionItemCreate(BaseModel):
    title: str = Field(min_length=1)
    assignee: str | None = None
    due_at: datetime | None = None


class ActionItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    assignee: str | None = None
    due_at: datetime | None = None
    is_completed: bool | None = None
