"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";
import { fetchMeeting, fetchSummary } from "@/lib/api/meetings";
import { formatDate, formatDuration } from "@/lib/utils";
import { getMeetingCaptureSource } from "@/lib/meetingCaptureSource";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MeetingDetailsPanel({
  meeting,
  open,
  onClose,
  className,
}: {
  meeting: MeetingListItem | null;
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  const meetingId = meeting?.id ?? 0;

  const detailQuery = useQuery({
    queryKey: ["meeting", meetingId, "details-panel"],
    queryFn: () => fetchMeeting(meetingId),
    enabled: open && meetingId > 0,
  });

  const summaryQuery = useQuery({
    queryKey: ["summary", meetingId, "details-panel"],
    queryFn: () => fetchSummary(meetingId),
    enabled: open && meetingId > 0,
  });

  if (!open || !meeting) return null;

  const capture = getMeetingCaptureSource(meeting.id);
  const CaptureIcon = capture.icon;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col border-l border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:h-full lg:w-[min(360px,90%)] lg:shadow-xl",
        className
      )}
      role="dialog"
      aria-label={`Details for ${meeting.title}`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-[var(--ff-border-subtle)] px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ff-text-muted)]">
            Meeting details
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--ff-text)]">
            {meeting.title}
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0" onClick={onClose}>
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Close details</span>
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
        <dl className="space-y-3">
          <div>
            <dt className="text-xs text-[var(--ff-text-muted)]">Host</dt>
            <dd className="text-[var(--ff-text)]">You (demo workspace)</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ff-text-muted)]">Date & time</dt>
            <dd className="text-[var(--ff-text-secondary)]">{formatDate(meeting.occurred_at)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ff-text-muted)]">Duration</dt>
            <dd className="text-[var(--ff-text-secondary)]">{formatDuration(meeting.duration_ms)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ff-text-muted)]">Captured from</dt>
            <dd className="inline-flex items-center gap-1.5 text-[var(--ff-text-secondary)]">
              <CaptureIcon className="h-3.5 w-3.5" aria-hidden />
              {capture.label}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--ff-text-muted)]">Participants</dt>
            <dd className="text-[var(--ff-text-secondary)]">
              {meeting.participants.join(", ") || "—"}
            </dd>
          </div>
        </dl>

        <div>
          <p className="text-xs font-medium text-[var(--ff-text-muted)]">Summary</p>
          {summaryQuery.isLoading && (
            <p className="mt-2 text-xs text-[var(--ff-text-muted)]">Loading summary…</p>
          )}
          {summaryQuery.data && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--ff-text-secondary)]">
              {summaryQuery.data.gist ?? summaryQuery.data.overview ?? "No summary available."}
            </p>
          )}
        </div>

        {detailQuery.data?.summary_gist && (
          <p className="text-xs text-[var(--ff-text-muted)]">{detailQuery.data.summary_gist}</p>
        )}

        <div className="rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] px-3 py-2 text-xs text-[var(--ff-text-muted)]">
          Privacy: workspace members with link (demo).
        </div>
      </div>

      <div className="border-t border-[var(--ff-border-subtle)] p-3">
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-[var(--ff-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--ff-accent-hover)]"
        >
          Open notepad
        </Link>
      </div>
    </div>
  );
}
