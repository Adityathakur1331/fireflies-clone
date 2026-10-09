"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  CheckSquare,
  ChevronRight,
  Mic,
  Play,
  Plus,
  Sparkles,
  Upload,
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
    label: "Schedule Meeting",
    tint: "from-rose-950/80 to-rose-950/30 border-rose-900/40",
    icon: Calendar,
    soon: true,
  },
  {
    key: "upload",
    label: "Upload File",
    tint: "from-emerald-950/80 to-emerald-950/30 border-emerald-900/40",
    icon: Upload,
    create: true,
  },
  {
    key: "capture",
    label: "Capture Meeting",
    tint: "from-indigo-950/80 to-indigo-950/30 border-indigo-900/40",
    icon: Plus,
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
        className="relative mb-6 overflow-hidden rounded-xl border border-[var(--ff-border-subtle)] px-5 py-6 md:flex md:items-center md:justify-between md:px-8 md:py-7"
        style={{
          background:
            "linear-gradient(135deg, rgba(120,53,15,0.35) 0%, rgba(15,15,18,0.95) 45%, rgba(15,15,18,1) 100%)",
        }}
      >
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-200/80">
            Welcome aboard
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--ff-text)] md:text-2xl">
            Welcome Aboard, ADITYA!
          </h2>
          <p className="mt-2 text-sm text-[var(--ff-text-secondary)]">
            Capture your first meeting or upload a recording to see your workspace in action.
          </p>
        </div>
        <div
          className="mt-4 flex h-28 w-full max-w-xs items-center justify-center rounded-lg border border-[var(--ff-border)] bg-black/40 md:mt-0"
          aria-hidden
        >
          <span className="flex items-center gap-2 text-xs text-[var(--ff-text-muted)]">
            <Play className="h-4 w-4" />
            Product demo (placeholder)
          </span>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-[15px] font-semibold text-[var(--ff-text)]">Quick Start</h3>
        <p className="mt-1 text-xs text-[var(--ff-text-muted)]">
          Capture your first meeting or upload a recording to see Fireflies in action.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            const inner = (
              <>
                <Icon className="h-5 w-5 text-[var(--ff-text)]" aria-hidden />
                <span className="mt-3 flex-1 text-sm font-medium text-[var(--ff-text)]">{item.label}</span>
                <ChevronRight className="mt-2 h-4 w-4 text-[var(--ff-text-muted)]" />
              </>
            );
            const boxClass = cn(
              "flex min-h-[120px] flex-col rounded-lg border bg-gradient-to-br p-4 text-left transition-opacity",
              item.tint
            );
            if (item.create) {
              return (
                <div key={item.key} className={boxClass}>
                  {inner}
                  <div className="mt-2">
                    <CreateMeetingDialog />
                  </div>
                </div>
              );
            }
            return (
              <button key={item.key} type="button" className={cn(boxClass, "opacity-90")} disabled>
                {inner}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 rounded-md border border-[var(--ff-border)] p-0.5">
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
                  "rounded px-3 py-1 text-[12px] font-medium",
                  tab === t.id
                    ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-muted)]"
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

        <div className="border border-[var(--ff-border-subtle)] bg-[var(--ff-bg)]">
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--ff-surface-elevated)]">
                        <CapIcon className="h-4 w-4 text-[var(--ff-text-secondary)]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[var(--ff-text)]">{m.title}</p>
                        <p className="text-[11px] text-[var(--ff-text-muted)]">
                          {formatDate(m.occurred_at)} · {formatDuration(m.duration_ms)}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--ff-text-muted)]" />
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
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-2 text-sm font-semibold text-[var(--ff-text)]">Try more</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { href: "/tasks", label: "Tasks", desc: "Action items from meetings", icon: CheckSquare },
            { href: "/voice-agents", label: "Voice Agents", desc: "AI phone agents", icon: Mic },
          ].map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] px-4 py-4 hover:bg-[var(--ff-sidebar-hover)]"
            >
              <Icon className="h-5 w-5 text-[var(--ff-accent-muted)]" />
              <p className="mt-2 font-medium text-[var(--ff-text)]">{label}</p>
              <p className="text-xs text-[var(--ff-text-muted)]">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
