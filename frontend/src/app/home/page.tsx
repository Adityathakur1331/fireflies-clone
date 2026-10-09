"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  CheckSquare,
  Mic,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { fetchMeetings } from "@/lib/api/meetings";
import { fetchAllTasks } from "@/lib/api/workspace";
import { formatDate, formatDuration } from "@/lib/utils";
import { getMeetingCaptureSource } from "@/lib/meetingCaptureSource";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    key: "schedule",
    label: "Schedule meeting",
    sub: "Calendar",
    icon: CalendarPlus,
    accent: "border-l-sky-500 bg-sky-500/10 hover:bg-sky-500/15",
    soon: true,
  },
  {
    key: "upload",
    label: "Upload file",
    sub: "Transcript or media",
    icon: Upload,
    accent: "border-l-violet-500 bg-violet-500/10 hover:bg-violet-500/15",
    create: true,
  },
  {
    key: "capture",
    label: "Capture meeting",
    sub: "Invite notetaker",
    icon: Video,
    accent: "border-l-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/15",
    soon: true,
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

  const recent = meetingsQuery.data?.items.slice(0, 5) ?? [];

  return (
    <AppShell title="Home" searchPlaceholder="Search by title or keyword">
      <section
        className="relative mb-6 overflow-hidden rounded-xl border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] px-5 py-6 md:px-8 md:py-8"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(124,58,237,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(56,189,248,0.08), transparent 50%)",
        }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--ff-accent-muted)]">
          Welcome aboard
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--ff-text)] md:text-2xl">
          Aditya, let&apos;s turn your meetings into searchable intelligence
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--ff-text-secondary)]">
          Review transcripts, summaries, and action items from your workspace library.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="mb-2 text-[13px] font-semibold text-[var(--ff-text)]">Quick start</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickActions.map((item) => {
            const Icon = item.icon;
            const base =
              "flex min-w-[168px] shrink-0 flex-col rounded-lg border border-[var(--ff-border-subtle)] border-l-4 px-3 py-3 text-left transition-colors";
            if (item.create) {
              return (
                <div key={item.key} className={cn(base, item.accent)}>
                  <Icon className="h-4 w-4 text-[var(--ff-text)]" aria-hidden />
                  <span className="mt-2 text-sm font-medium text-[var(--ff-text)]">{item.label}</span>
                  <span className="text-[11px] text-[var(--ff-text-muted)]">{item.sub}</span>
                  <div className="mt-2">
                    <CreateMeetingDialog />
                  </div>
                </div>
              );
            }
            return (
              <button
                key={item.key}
                type="button"
                className={cn(base, item.accent, "opacity-90")}
                disabled={item.soon}
                title={item.soon ? "Coming soon in this demo" : undefined}
              >
                <Icon className="h-4 w-4 text-[var(--ff-text)]" aria-hidden />
                <span className="mt-2 text-sm font-medium text-[var(--ff-text)]">{item.label}</span>
                <span className="text-[11px] text-[var(--ff-text-muted)]">{item.sub}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ff-border-subtle)]">
          <div className="flex gap-0.5">
            {(
              [
                { id: "recent" as const, label: "Recent" },
                { id: "upcoming" as const, label: "Upcoming" },
                { id: "feed" as const, label: "AI Feed" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-3 py-2 text-[13px] font-medium",
                  tab === t.id
                    ? "text-[var(--ff-text)] border-b-2 border-[var(--ff-accent)] -mb-px"
                    : "text-[var(--ff-text-muted)] hover:text-[var(--ff-text-secondary)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Link
            href="/meetings"
            className="text-[11px] font-medium text-[var(--ff-accent-muted)] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="min-h-[12rem] border border-t-0 border-[var(--ff-border-subtle)] bg-[var(--ff-bg)]">
          {tab === "recent" && (
            <ul className="divide-y divide-[var(--ff-border-subtle)]">
              {meetingsQuery.isLoading && (
                <li className="px-4 py-8 text-center text-sm text-[var(--ff-text-muted)]">Loading…</li>
              )}
              {recent.map((m) => {
                const cap = getMeetingCaptureSource(m.id);
                const CapIcon = cap.icon;
                return (
                  <li key={m.id}>
                    <Link
                      href={`/meetings/${m.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--ff-sidebar-hover)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--ff-surface-elevated)] text-[var(--ff-text-secondary)]">
                        <CapIcon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[var(--ff-text)]">{m.title}</p>
                        <p className="text-[11px] text-[var(--ff-text-muted)]">
                          {formatDate(m.occurred_at)} · {formatDuration(m.duration_ms)}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--ff-text-muted)]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {tab === "upcoming" && (
            <div className="flex items-center gap-3 px-4 py-12 text-sm text-[var(--ff-text-secondary)]">
              <Calendar className="h-5 w-5 text-[var(--ff-text-muted)]" />
              Connect a calendar to see upcoming meetings (placeholder).
            </div>
          )}
          {tab === "feed" && (
            <ul className="divide-y divide-[var(--ff-border-subtle)]">
              {(tasksQuery.data?.slice(0, 4) ?? []).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/meetings/${t.meeting_id}`}
                    className="flex items-start gap-2 px-3 py-2.5 hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 text-[var(--ff-accent-muted)]" />
                    <div>
                      <p className="text-[13px] text-[var(--ff-text)]">{t.title}</p>
                      <p className="text-[11px] text-[var(--ff-text-muted)]">{t.meeting_title}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {!tasksQuery.data?.length && (
                <li className="px-4 py-10 text-center text-sm text-[var(--ff-text-muted)]">No AI feed items.</li>
              )}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/tasks", label: "Tasks", desc: "Action items from meetings", icon: CheckSquare },
          { href: "/ai-skills", label: "AI Skills", desc: "Automations on your notes", icon: Sparkles },
          { href: "/voice-agents", label: "Voice Agents", desc: "AI phone agents", icon: Mic },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] px-4 py-3 hover:border-[var(--ff-border)] hover:bg-[var(--ff-sidebar-hover)]"
          >
            <Icon className="h-4 w-4 text-[var(--ff-accent-muted)]" aria-hidden />
            <p className="mt-2 text-sm font-medium text-[var(--ff-text)]">{label}</p>
            <p className="text-[11px] text-[var(--ff-text-muted)]">{desc}</p>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
