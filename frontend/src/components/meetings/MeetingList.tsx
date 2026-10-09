"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Info } from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";
import { MeetingListRowMenu } from "./MeetingListRowMenu";
import { MeetingDetailsPanel } from "./MeetingDetailsPanel";
import { formatDate, formatDuration } from "@/lib/utils";
import { speakerColorClass, speakerInitials } from "@/lib/speaker";
import { getMeetingCaptureSource } from "@/lib/meetingCaptureSource";
import { cn } from "@/lib/utils";

export function MeetingList({ meetings }: { meetings: MeetingListItem[] }) {
  const [detailsMeeting, setDetailsMeeting] = useState<MeetingListItem | null>(null);

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
    <div className="relative">
      <div className="ff-panel overflow-hidden">
        <ul className="divide-y divide-[var(--ff-border-subtle)]">
          {meetings.map((m) => (
            <MeetingRow
              key={m.id}
              meeting={m}
              onDetails={() => setDetailsMeeting(m)}
              detailsActive={detailsMeeting?.id === m.id}
            />
          ))}
        </ul>
      </div>

      <MeetingDetailsPanel
        meeting={detailsMeeting}
        open={detailsMeeting !== null}
        onClose={() => setDetailsMeeting(null)}
        className="fixed inset-y-0 right-0 z-30 md:absolute"
      />
    </div>
  );
}

function MeetingRow({
  meeting: m,
  onDetails,
  detailsActive,
}: {
  meeting: MeetingListItem;
  onDetails: () => void;
  detailsActive: boolean;
}) {
  const capture = getMeetingCaptureSource(m.id);
  const CaptureIcon = capture.icon;

  return (
    <li className="group relative">
      <Link
        href={`/meetings/${m.id}`}
        className="flex flex-col gap-2 px-4 py-3 pr-24 transition-colors hover:bg-[var(--ff-sidebar-hover)] sm:flex-row sm:items-center sm:gap-4 sm:py-3.5 sm:pr-32"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--ff-surface-elevated)] text-[var(--ff-text-secondary)]"
            title={capture.label}
            aria-label={capture.label}
          >
            <CaptureIcon className="h-4 w-4" />
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

      <div className="absolute right-2 top-2 flex items-center gap-0.5 sm:top-1/2 sm:-translate-y-1/2">
        <button
          type="button"
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-medium opacity-0 transition-opacity hover:bg-[var(--ff-sidebar-hover)] group-hover:opacity-100 focus-visible:opacity-100",
            detailsActive
              ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)] opacity-100"
              : "text-[var(--ff-text-secondary)]"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDetails();
          }}
        >
          <span className="hidden sm:inline">Details</span>
          <Info className="h-4 w-4 sm:hidden" aria-hidden />
        </button>
        <MeetingListRowMenu meeting={m} />
      </div>
    </li>
  );
}
