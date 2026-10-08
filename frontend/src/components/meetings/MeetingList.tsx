"use client";

import Link from "next/link";
import { Clock, Mic2, Video } from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";
import { MeetingListRowMenu } from "./MeetingListRowMenu";
import { formatDate, formatDuration } from "@/lib/utils";
import { speakerColorClass, speakerInitials } from "@/lib/speaker";
import { cn } from "@/lib/utils";

export function MeetingList({ meetings }: { meetings: MeetingListItem[] }) {
  if (!meetings.length) {
    return (
      <div className="ff-panel px-6 py-14 text-center">
        <p className="text-sm font-medium text-[var(--ff-text)]">No meetings found</p>
        <p className="mt-1 text-sm text-[var(--ff-text-secondary)]">
          Adjust filters or capture a new meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="ff-panel overflow-hidden">
      <ul className="divide-y divide-[var(--ff-border-subtle)]">
        {meetings.map((m) => (
          <MeetingRow key={m.id} meeting={m} />
        ))}
      </ul>
    </div>
  );
}

function MeetingRow({ meeting: m }: { meeting: MeetingListItem }) {
  return (
    <li className="group relative">
      <Link
        href={`/meetings/${m.id}`}
        className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-[var(--ff-sidebar-hover)] sm:flex-row sm:items-center sm:gap-4 sm:py-3.5"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--ff-surface-elevated)] text-[var(--ff-text-secondary)]"
            aria-hidden
          >
            <Video className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-[var(--ff-text)] group-hover:text-[var(--ff-accent-muted)]">
              {m.title}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--ff-text-muted)]">
              <span>{formatDate(m.occurred_at)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {formatDuration(m.duration_ms)}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5 rounded bg-[var(--ff-surface-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ff-text-secondary)]">
                <Mic2 className="h-2.5 w-2.5" aria-hidden />
                Recording
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pl-12 sm:pl-0">
          <div className="flex -space-x-1.5" aria-label="Participants">
            {m.participants.slice(0, 5).map((p) => (
              <span
                key={p}
                title={p}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--ff-surface)] text-[10px] font-semibold",
                  speakerColorClass(p)
                )}
              >
                {speakerInitials(p)}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2 sm:top-1/2 sm:-translate-y-1/2">
        <MeetingListRowMenu meeting={m} />
      </div>
    </li>
  );
}
