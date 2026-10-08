"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { answerAskFred, getSuggestedQuestions } from "@/lib/askfred";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AskFredPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

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
    <AppShell title="AskFred" subtitle="Ask questions about your meetings (demo intelligence)">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <section className="ff-panel p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900">What would you like to know?</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Answers use your real meetings, summaries, and action items (deterministic demo — not a
            live LLM).
          </p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about decisions, tasks, or topics…"
              className="h-10"
              aria-label="AskFred question"
            />
            <Button type="submit" className="shrink-0">
              <Send className="h-4 w-4" aria-hidden />
              Ask
            </Button>
          </form>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Suggested
          </p>
          <div className="flex flex-wrap gap-2">
            {suggested.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-full border border-[var(--ff-border)] bg-white px-3 py-1.5 text-left text-xs text-zinc-700 hover:border-violet-200 hover:bg-violet-50"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="ff-panel min-h-[160px] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Fred</p>
          {answer ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
              {answer}
            </p>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              Pick a suggestion or type a question to see a workspace-aware response.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
