import type { TaskWithMeeting } from "@/lib/api/workspace";
import type { MeetingListItem } from "@/types/meeting";
import { formatDuration } from "@/lib/utils";

const SUGGESTED = [
  "What were the main decisions from my meetings?",
  "What are my outstanding action items?",
  "Summarize this week's meetings.",
  "What topics were discussed most?",
];

export function getSuggestedQuestions() {
  return SUGGESTED;
}

export function answerAskFred(
  question: string,
  meetings: MeetingListItem[],
  tasks: TaskWithMeeting[],
  topTopics: { topic: string; count: number }[]
): string {
  const q = question.toLowerCase().trim();
  if (!q) {
    return "Ask a question about your meetings, summaries, or action items.";
  }

  if (
    q.includes("action item") ||
    q.includes("outstanding") ||
    q.includes("todo") ||
    q.includes("task")
  ) {
    const open = tasks.filter((t) => !t.is_completed);
    if (!open.length) {
      return "You have no open action items across your meetings. Nice work!";
    }
    const lines = open.slice(0, 12).map(
      (t) => `• ${t.title}${t.assignee ? ` (${t.assignee})` : ""} — from “${t.meeting_title}”`
    );
    return `You have ${open.length} open action item${open.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}`;
  }

  if (q.includes("topic") || q.includes("discussed most")) {
    if (!topTopics.length) {
      return "Topic data is drawn from seeded AI summaries. No topics are indexed yet.";
    }
    const lines = topTopics.map((t) => `• ${t.topic} (${t.count} meeting${t.count === 1 ? "" : "s"})`);
    return `Most common key topics across your library:\n\n${lines.join("\n")}`;
  }

  if (q.includes("summarize") || q.includes("week") || q.includes("recent")) {
    const recent = meetings.slice(0, 5);
    if (!recent.length) return "No meetings in your workspace yet.";
    const lines = recent.map(
      (m) =>
        `• ${m.title} — ${new Date(m.occurred_at).toLocaleDateString()} (${formatDuration(m.duration_ms)})`
    );
    return `Here are your most recent meetings:\n\n${lines.join("\n")}\n\nOpen any meeting in the library for the full AI summary and transcript.`;
  }

  if (q.includes("decision") || q.includes("main")) {
    const titles = meetings.slice(0, 4).map((m) => m.title);
    return (
      `Based on your seeded meeting intelligence, recent sessions (${titles.join(", ")}) ` +
      `cover pilots, product roadmap, incident response, and customer success themes. ` +
      `Open a specific meeting notepad for chapter-level decisions and action items tied to that call.`
    );
  }

  return (
    `I can help with action items, recent meetings, and top discussion topics using your workspace data. ` +
    `Try: “${SUGGESTED[1]}” or “${SUGGESTED[3]}”`
  );
}
