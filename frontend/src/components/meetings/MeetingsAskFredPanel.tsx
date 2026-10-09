"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  CheckCircle2,
  Hash,
  Pin,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";
import { answerAskFred } from "@/lib/askfred";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHANNEL_LABEL: Record<string, string> = {
  mine: "My Meetings",
  all: "All Meetings",
  uploads: "Uploads",
  voice: "Voice Agent Meetings",
};

const QUICK_PROMPTS = [
  { label: "My action items", icon: CheckCircle2, q: "What are my outstanding action items?" },
  { label: "Key decisions", icon: Pin, q: "What were the main decisions from my meetings?" },
  { label: "Key initiatives", icon: Pin, q: "What topics were discussed most?" },
];

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

  const submit = (q: string) => {
    const tasks = tasksQuery.data ?? [];
    const topics = statsQuery.data?.top_topics ?? [];
    setQuery(q);
    setAnswer(answerAskFred(q, meetings, tasks, topics));
  };

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-t border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] lg:w-[min(340px,28%)] lg:min-w-[300px] lg:max-w-[360px] lg:border-l lg:border-t-0",
        className
      )}
      aria-label="AskFred"
    >
      <header className="flex items-center justify-between border-b border-[var(--ff-border-subtle)] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[var(--ff-accent-muted)]" aria-hidden />
          <h2 className="text-[13px] font-semibold text-[var(--ff-text)]">Ask Fred</h2>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-[var(--ff-border-subtle)] px-3 py-2">
          <div className="rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] px-3 py-2.5 text-[11px] text-[var(--ff-text-secondary)]">
            Connect Slack and Gmail for richer answers —{" "}
            <span className="text-[var(--ff-accent-muted)]">Connect (demo)</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
          {!answer ? (
            <>
              <Sparkles className="h-5 w-5 text-emerald-400/90" aria-hidden />
              <p className="mt-3 text-sm font-medium text-[var(--ff-text)]">
                Hi ADITYA! Get ready for your meeting
              </p>
              <p className="mt-1 text-[11px] text-[var(--ff-text-muted)]">
                {meetings.length} meeting{meetings.length === 1 ? "" : "s"} in {channelLabel}
              </p>
              <div className="mt-4 flex w-full max-w-[260px] flex-col gap-2">
                {QUICK_PROMPTS.map(({ label, icon: Icon, q }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => submit(q)}
                    className="flex items-center gap-2 rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] px-3 py-2 text-left text-[12px] text-[var(--ff-text-secondary)] hover:border-[var(--ff-border)] hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--ff-text-muted)]" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full max-h-full overflow-y-auto text-left">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ff-text-secondary)]">
                {answer}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--ff-border-subtle)] p-3">
          <p className="mb-1.5 flex items-center gap-1 text-[11px] text-[var(--ff-text-muted)]">
            <Hash className="h-3 w-3" aria-hidden />
            {channelLabel}
          </p>
          <div className="rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] p-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (query.trim()) submit(query);
                }
              }}
              placeholder="Ask anything. Type / to run AI skills."
              rows={2}
              className="w-full resize-none bg-transparent text-[13px] text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus:outline-none"
              aria-label="AskFred question"
            />
            <div className="mt-1 flex items-center justify-between">
              <button type="button" className="rounded p-1 text-[var(--ff-text-muted)]" aria-label="Add">
                <Plus className="h-4 w-4" />
              </button>
              <Button size="sm" className="h-7 w-7 p-0" disabled={!query.trim()} onClick={() => submit(query)}>
                <Send className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
