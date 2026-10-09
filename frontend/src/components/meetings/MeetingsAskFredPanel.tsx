"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Sparkles } from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";
import { answerAskFred, getSuggestedQuestions } from "@/lib/askfred";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHANNEL_LABEL: Record<string, string> = {
  mine: "My Meetings",
  all: "All Meetings",
  uploads: "Uploads",
  voice: "Voice Agent Meetings",
};

export function MeetingsAskFredPanel({
  meetings,
  channelView,
  className,
}: {
  meetings: MeetingListItem[];
  channelView: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const tasksQuery = useQuery({
    queryKey: ["tasks", "meetings-askfred"],
    queryFn: () => fetchAllTasks(true),
  });
  const statsQuery = useQuery({
    queryKey: ["workspace-stats", "meetings-askfred"],
    queryFn: fetchWorkspaceStats,
  });

  const channelLabel = CHANNEL_LABEL[channelView] ?? "Meetings";
  const suggested = getSuggestedQuestions().slice(0, 3);

  const submit = (q: string) => {
    const tasks = tasksQuery.data ?? [];
    const topics = statsQuery.data?.top_topics ?? [];
    setQuery(q);
    setAnswer(answerAskFred(q, meetings, tasks, topics));
  };

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-t border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] lg:w-[min(360px,32%)] lg:min-w-[280px] lg:border-l lg:border-t-0",
        className
      )}
      aria-label="AskFred"
    >
      <header className="border-b border-[var(--ff-border-subtle)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--ff-accent-muted)]" aria-hidden />
          <h2 className="text-sm font-semibold text-[var(--ff-text)]">AskFred</h2>
        </div>
        <p className="mt-1 text-[11px] text-[var(--ff-text-muted)]">
          Answers use meetings in <span className="font-medium text-[var(--ff-text-secondary)]">{channelLabel}</span>{" "}
          ({meetings.length} in context).
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        {answer && (
          <div className="mb-3 max-h-[40%] shrink-0 overflow-y-auto rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ff-text-secondary)]">
              {answer}
            </p>
          </div>
        )}

        <div className="mt-auto space-y-2">
          <div className="space-y-1.5">
            {suggested.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="w-full rounded-md border border-[var(--ff-border)] px-2.5 py-2 text-left text-[11px] leading-snug text-[var(--ff-text-secondary)] hover:border-[var(--ff-accent)]/30 hover:bg-[var(--ff-sidebar-hover)]"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--ff-accent)]/30 bg-[var(--ff-surface)] p-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (query.trim()) submit(query);
                }
              }}
              placeholder="Ask about this channel…"
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus:outline-none"
              aria-label="AskFred question"
            />
            <div className="flex justify-end pt-1">
              <Button size="sm" disabled={!query.trim()} onClick={() => submit(query)}>
                <Send className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
