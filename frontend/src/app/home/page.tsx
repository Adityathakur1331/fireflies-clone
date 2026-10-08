"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckSquare, MessageCircle, Video } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { formatDate, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const meetingsQuery = useQuery({
    queryKey: ["meetings", { home: true }],
    queryFn: () => fetchMeetings({ sort: "occurred_at_desc", limit: 6 }),
  });
  const tasksQuery = useQuery({
    queryKey: ["tasks", { open: true }],
    queryFn: () => fetchAllTasks(false),
  });
  const statsQuery = useQuery({
    queryKey: ["workspace-stats"],
    queryFn: fetchWorkspaceStats,
  });

  const recent = meetingsQuery.data?.items.slice(0, 5) ?? [];
  const openTasks = tasksQuery.data?.slice(0, 5) ?? [];
  const stats = statsQuery.data;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell
      title="Home"
      subtitle="Your meeting intelligence workspace"
      actions={<CreateMeetingDialog />}
    >
      <section className="mb-6 ff-panel p-5">
        <h2 className="text-lg font-semibold text-zinc-900">
          {greeting}, Demo User
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Review transcripts, AI summaries, and action items from your meetings library.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/askfred">
              <MessageCircle className="h-4 w-4" aria-hidden />
              AskFred
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/meetings">Browse meetings</Link>
          </Button>
        </div>
      </section>

      {stats && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Meetings", value: stats.total_meetings },
            {
              label: "Meeting time",
              value: formatDuration(stats.total_duration_ms),
            },
            { label: "Open tasks", value: stats.open_action_items },
            { label: "Completed tasks", value: stats.completed_action_items },
          ].map((s) => (
            <div key={s.label} className="ff-panel px-4 py-3">
              <p className="text-xs font-medium text-zinc-500">{s.label}</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ff-panel overflow-hidden">
          <header className="flex items-center justify-between border-b border-[var(--ff-border)] px-4 py-3">
            <h3 className="text-sm font-semibold text-zinc-900">Recent meetings</h3>
            <Link href="/meetings" className="text-xs font-medium text-violet-700 hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-[var(--ff-border)]">
            {meetingsQuery.isLoading && (
              <li className="px-4 py-6 text-sm text-zinc-500">Loading…</li>
            )}
            {recent.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                    <Video className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{m.title}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(m.occurred_at)} · {formatDuration(m.duration_ms)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="ff-panel overflow-hidden">
          <header className="flex items-center justify-between border-b border-[var(--ff-border)] px-4 py-3">
            <h3 className="text-sm font-semibold text-zinc-900">Outstanding tasks</h3>
            <Link href="/tasks" className="text-xs font-medium text-violet-700 hover:underline">
              All tasks
            </Link>
          </header>
          <ul className="divide-y divide-[var(--ff-border)]">
            {tasksQuery.isLoading && (
              <li className="px-4 py-6 text-sm text-zinc-500">Loading…</li>
            )}
            {!openTasks.length && !tasksQuery.isLoading && (
              <li className="px-4 py-8 text-center text-sm text-zinc-500">No open tasks</li>
            )}
            {openTasks.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/meetings/${t.meeting_id}`}
                  className="flex items-start gap-2 px-4 py-3 hover:bg-zinc-50"
                >
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-800">{t.title}</p>
                    <p className="truncate text-xs text-zinc-500">{t.meeting_title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
