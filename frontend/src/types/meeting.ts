export interface MeetingListItem {
  id: number;
  title: string;
  occurred_at: string;
  duration_ms: number;
  participants: string[];
}

export interface Participant {
  id: number;
  display_name: string;
  email: string | null;
}

export interface MeetingDetail {
  id: number;
  title: string;
  occurred_at: string;
  duration_ms: number;
  media_url: string | null;
  media_type: string | null;
  description: string | null;
  participants: Participant[];
  summary_gist: string | null;
}

export interface PaginatedMeetings {
  items: MeetingListItem[];
  total: number;
}

export interface TranscriptSegment {
  id: number;
  speaker_label: string;
  start_ms: number;
  end_ms: number;
  content: string;
  sequence: number;
}

export interface SummaryChapter {
  id: number;
  title: string;
  start_ms: number;
  sort_order: number;
}

export interface SummaryResponse {
  overview: string | null;
  gist: string | null;
  key_topics: string[];
  chapters: SummaryChapter[];
}

export interface ActionItem {
  id: number;
  title: string;
  is_completed: boolean;
  assignee: string | null;
  due_at: string | null;
  sort_order: number;
}
