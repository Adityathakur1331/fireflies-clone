import { apiFetch } from "./client";
import type {
  ActionItem,
  MeetingDetail,
  MeetingListItem,
  PaginatedMeetings,
  SummaryResponse,
  TranscriptSegment,
} from "@/types/meeting";

export interface MeetingFilters {
  q?: string;
  participant?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export function fetchMeetings(filters: MeetingFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return apiFetch<PaginatedMeetings>(`/api/meetings${qs ? `?${qs}` : ""}`);
}

export function fetchMeeting(id: number) {
  return apiFetch<MeetingDetail>(`/api/meetings/${id}`);
}

export function createMeeting(body: Record<string, unknown>) {
  return apiFetch<MeetingDetail>("/api/meetings", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateMeeting(id: number, body: Record<string, unknown>) {
  return apiFetch<MeetingDetail>(`/api/meetings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteMeeting(id: number) {
  return apiFetch<void>(`/api/meetings/${id}`, { method: "DELETE" });
}

export function fetchTranscript(meetingId: number) {
  return apiFetch<TranscriptSegment[]>(`/api/meetings/${meetingId}/transcript`);
}

export function fetchSummary(meetingId: number) {
  return apiFetch<SummaryResponse>(`/api/meetings/${meetingId}/summary`);
}

export function fetchActionItems(meetingId: number) {
  return apiFetch<ActionItem[]>(`/api/meetings/${meetingId}/action-items`);
}

export function createActionItem(
  meetingId: number,
  body: { title: string; assignee?: string }
) {
  return apiFetch<ActionItem>(`/api/meetings/${meetingId}/action-items`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateActionItem(
  meetingId: number,
  itemId: number,
  body: Partial<{ title: string; assignee: string; is_completed: boolean }>
) {
  return apiFetch<ActionItem>(`/api/meetings/${meetingId}/action-items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteActionItem(meetingId: number, itemId: number) {
  return apiFetch<void>(`/api/meetings/${meetingId}/action-items/${itemId}`, {
    method: "DELETE",
  });
}

export type { MeetingListItem };
