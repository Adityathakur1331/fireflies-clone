"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Mic,
  Plus,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AskFredHistorySidebar, AskFredSidebar } from "@/components/askfred/AskFredSidebar";
import { answerAskFred, getSuggestedQuestions } from "@/lib/askfred";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { Button } from "@/components/ui/button";

const suggestionMeta: Record<string, { icon: typeof CheckCircle2 }> = {
  "List my action items & todos for this week": { icon: CheckCircle2 },
  "Summarize my last meeting": { icon: Sparkles },
  "Prepare me for the upcoming meeting": { icon: Wand2 },
  "Prepare weekly digest, based on my meetings": { icon: CalendarCheck },
};

function AskFredPageContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (initialQ) setQuery(initialQ);
  }, [initialQ]);

  const meetingsQuery = useQuery({
    queryKey: ["meetings", { askfred: true }],
    queryFn: () => fetchMeetings({ sort: "occurred_at_desc", limit: 20 }),
  });
  const tasksQuery = useQuery({
    queryKey: ["tasks", "askfred"],
    queryFn: () => fetchAllTasks(true),
  });
  const statsQuery = useQuery({
    queryKey: ["workspace-stats"],
    queryFn: fetchWorkspaceStats,
  });

  const suggested = getSuggestedQuestions();

  const submit = (q: string) => {
    const meetings = meetingsQuery.data?.items ?? [];
    const tasks = tasksQuery.data ?? [];
    const topics = statsQuery.data?.top_topics ?? [];
    setQuery(q);
    setAnswer(answerAskFred(q, meetings, tasks, topics));
  };

  return (
    <AppShell title="AskFred" flush searchPlaceholder="Search by title or keyword">
      <div className="flex min-h-0 flex-1">
        <AskFredSidebar />
        <AskFredHistorySidebar />
        <div className="flex flex-1 flex-col items-center overflow-auto bg-[var(--ff-bg)] px-4 py-10 md:px-8">
          <div className="w-full max-w-[640px] flex-1">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-[var(--ff-text)] md:text-[28px]">
              Hi ADITYA, how can I help today?
            </h2>

            <div
              className="mt-8 rounded-xl border border-[var(--ff-accent)]/50 bg-[var(--ff-surface)] p-3 shadow-[0_0_24px_rgba(124,58,237,0.08)]"
            >
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (query.trim()) submit(query);
                  }
                }}
                placeholder="Ask anything, @ for context and / for skills"
                className="min-h-[72px] w-full resize-none bg-transparent text-sm text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus:outline-none"
                aria-label="AskFred message"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--ff-border-subtle)] pt-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-[var(--ff-text-muted)] hover:bg-[var(--ff-sidebar-hover)]"
                    aria-label="Add attachment"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[var(--ff-text-muted)] hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Connectors
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    Sonnet 5
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-[var(--ff-text-muted)] hover:bg-[var(--ff-sidebar-hover)]"
                    aria-label="Voice input (demo)"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => submit(query)}
                    disabled={!query.trim()}
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)]/60 px-3 py-2 text-[11px] text-[var(--ff-text-muted)]"
            >
              <span>Bring context from 100+ apps with custom MCP</span>
              <span className="text-[var(--ff-accent-muted)]">+ Add (demo)</span>
            </div>

            <div className="mt-6 space-y-2">
              {suggested.map((s) => {
                const Icon = suggestionMeta[s]?.icon ?? Sparkles;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="flex w-full items-center gap-3 rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] px-4 py-3 text-left text-[13px] text-[var(--ff-text-secondary)] transition-colors hover:border-[var(--ff-accent)]/25 hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--ff-text-muted)]" />
                    {s}
                  </button>
                );
              })}
            </div>

            {answer && (
              <div className="mt-8 rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] p-5">
                <p className="text-xs font-semibold text-[var(--ff-accent-muted)]">Fred</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ff-text-secondary)]">
                  {answer}
                </p>
              </div>
            )}
          </div>
          <p className="mt-8 text-center text-[11px] text-[var(--ff-text-muted)]">
            Consumes AI credits (demo — not a live model).
          </p>
        </div>
      </div>
    </AppShell>
  );
}

export default function AskFredPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="AskFred">
          <p className="text-sm text-[var(--ff-text-muted)]">Loading…</p>
        </AppShell>
      }
    >
      <AskFredPageContent />
    </Suspense>
  );
}
