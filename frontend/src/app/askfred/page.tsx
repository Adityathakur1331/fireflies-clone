"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AskFredHistorySidebar, AskFredSidebar } from "@/components/askfred/AskFredSidebar";
import { answerAskFred, getSuggestedQuestions } from "@/lib/askfred";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-1 flex-col items-center overflow-auto bg-[var(--ff-bg)] px-4 py-8 md:px-8">
          <div className="w-full max-w-2xl flex-1">
            <h2 className="text-center text-2xl font-semibold text-[var(--ff-text)] md:text-3xl">
              Hi Aditya, how can I help today?
            </h2>
            <div className="mt-6 rounded-xl border border-[var(--ff-accent)]/40 bg-[var(--ff-surface)] p-3 shadow-[0_0_0_1px_rgba(124,58,237,0.15)]">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything — use your meeting library for context"
                className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus:outline-none"
                aria-label="AskFred message"
              />
              <div className="mt-2 flex items-center justify-between border-t border-[var(--ff-border-subtle)] pt-2">
                <span className="text-[11px] text-[var(--ff-text-muted)]">Demo intelligence · seeded data</span>
                <Button size="sm" onClick={() => submit(query)} disabled={!query.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {suggested.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="flex w-full items-center gap-2 rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] px-4 py-3 text-left text-sm text-[var(--ff-text-secondary)] hover:border-[var(--ff-accent)]/30 hover:bg-[var(--ff-sidebar-hover)]"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--ff-accent-muted)]" />
                  {s}
                </button>
              ))}
            </div>

            {answer && (
              <div className="mt-8 ff-panel p-5">
                <p className="text-xs font-semibold text-[var(--ff-accent-muted)]">Fred</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ff-text-secondary)]">
                  {answer}
                </p>
              </div>
            )}
          </div>
          <p className="mt-8 text-center text-[11px] text-[var(--ff-text-muted)]">
            Consumes demo AI credits (not a live model).
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
