"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  CheckSquare,
  MessageCircle,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks, fetchWorkspaceStats } from "@/lib/api/workspace";
import { formatDate, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const quickStart = [
  {
    title: "Upload a transcript",
    description: "Create a meeting from pasted or uploaded text.",
    icon: Upload,
    action: "create" as const,
  },
  {
    title: "Browse meetings",
    description: "Open your library of recorded conversations.",
    icon: Video,
    href: "/meetings",
  },
  {
    title: "AskFred",
    description: "Query decisions, tasks, and topics across meetings.",
    icon: MessageCircle,
    href: "/askfred",
  },
];

export default function HomePage() {
  const [tab, setTab] = useState<"recent" | "upcoming" | "feed">("recent");

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

  const recent = meetingsQuery.data?.items.slice(0, 4) ?? [];
  const stats = statsQuery.data;

  return (
    <AppShell title="Home" searchPlaceholder="Search by title or keyword">
      <section className="mb-8 ff-panel overflow-hidden p-6 md:p-8">
        <p className="text-sm text-[var(--ff-text-muted)]">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--ff-text)] md:text-3xl">
          Aditya, your meeting intelligence is ready
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ff-text-secondary)]">
          Review transcripts, AI summaries, and action items from your workspace library.
        </p>
        {stats && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--ff-text-muted)]">
            <span>{stats.total_meetings} meetings</span>
            <span>{formatDuration(stats.total_duration_ms)} recorded</span>
            <span>{stats.open_action_items} open tasks</span>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-[var(--ff-text)]">Quick start</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {quickStart.map((item) => (
            <div key={item.title} className="ff-panel flex flex-col p-4">
              <item.icon className="h-5 w-5 text-[var(--ff-accent-muted)]" />
              <p className="mt-2 font-medium text-[var(--ff-text)]">{item.title}</p>
              <p className="mt-1 flex-1 text-xs text-[var(--ff-text-secondary)]">
                {item.description}
              </p>
              <div className="mt-3">
                {item.action === "create" ? (
                  <CreateMeetingDialog />
                ) : (
                  <Link
                    href={item.href!}
                    className="text-xs font-medium text-[var(--ff-accent-muted)] hover:underline"
                  >
                    Open →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 border-b border-[var(--ff-border)]">
            {(
              [
                { id: "recent" as const, label: "Recent" },
                { id: "upcoming" as const, label: "Upcoming" },
                { id: "feed" as const, label: "AI feed" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium",
                  tab === t.id
                    ? "text-[var(--ff-text)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--ff-accent)]"
                    : "text-[var(--ff-text-muted)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link href="/meetings" className="text-xs text-[var(--ff-accent-muted)] hover:underline">
            View all meetings
          </Link>
        </div>

        <div className="ff-panel overflow-hidden">
          {tab === "recent" && (
            <ul className="divide-y divide-[var(--ff-border-subtle)]">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/meetings/${m.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    <Video className="h-4 w-4 text-[var(--ff-text-muted)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--ff-text)]">{m.title}</p>
                      <p className="text-xs text-[var(--ff-text-muted)]">
                        {formatDate(m.occurred_at)} · {formatDuration(m.duration_ms)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--ff-text-muted)]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {tab === "upcoming" && (
            <div className="flex items-center gap-3 px-4 py-10 text-sm text-[var(--ff-text-secondary)]">
              <Calendar className="h-5 w-5 text-[var(--ff-text-muted)]" />
              Calendar sync is not connected in this demo build.
            </div>
          )}
          {tab === "feed" && (
            <div className="space-y-0 divide-y divide-[var(--ff-border-subtle)]">
              {(tasksQuery.data?.slice(0, 3) ?? []).map((t) => (
                <Link
                  key={t.id}
                  href={`/meetings/${t.meeting_id}`}
                  className="flex items-start gap-2 px-4 py-3 hover:bg-[var(--ff-sidebar-hover)]"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 text-[var(--ff-accent-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--ff-text)]">Open task: {t.title}</p>
                    <p className="text-xs text-[var(--ff-text-muted)]">{t.meeting_title}</p>
                  </div>
                </Link>
              ))}
              {!tasksQuery.data?.length && (
                <p className="px-4 py-8 text-center text-sm text-[var(--ff-text-muted)]">
                  No feed items yet.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-[var(--ff-text)]">Try more</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/tasks" className="ff-panel px-4 py-2 text-xs font-medium hover:bg-[var(--ff-sidebar-hover)]">
            <CheckSquare className="mr-1 inline h-3.5 w-3.5" />
            Tasks
          </Link>
          <Link href="/ai-skills" className="ff-panel px-4 py-2 text-xs font-medium hover:bg-[var(--ff-sidebar-hover)]">
            AI Skills
          </Link>
          <Link href="/analytics" className="ff-panel px-4 py-2 text-xs font-medium hover:bg-[var(--ff-sidebar-hover)]">
            Analytics
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
