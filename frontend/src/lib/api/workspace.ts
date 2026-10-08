import { apiFetch } from "./client";

export interface TaskWithMeeting {
  id: number;
  title: string;
  is_completed: boolean;
  assignee: string | null;
  due_at: string | null;
  sort_order: number;
  meeting_id: number;
  meeting_title: string;
  meeting_occurred_at: string;
}

export interface WorkspaceStats {
  total_meetings: number;
  total_duration_ms: number;
  total_action_items: number;
  completed_action_items: number;
  open_action_items: number;
  meetings_by_month: { month: string; count: number }[];
  top_topics: { topic: string; count: number }[];
}

export function fetchAllTasks(includeCompleted = true) {
  return apiFetch<TaskWithMeeting[]>(
    `/api/tasks?include_completed=${includeCompleted ? "true" : "false"}`
  );
}

export function fetchWorkspaceStats() {
  return apiFetch<WorkspaceStats>("/api/workspace/stats");
}
