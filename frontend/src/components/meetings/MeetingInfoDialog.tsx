"use client";

import type { MeetingListItem } from "@/types/meeting";
import { formatDate, formatDuration } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MeetingInfoDialog({
  meeting,
  open,
  onOpenChange,
}: {
  meeting: MeetingListItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meeting info</DialogTitle>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs font-medium text-[var(--ff-text-muted)]">Title</dt>
            <dd className="font-medium text-[var(--ff-text)]">{meeting.title}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--ff-text-muted)]">Date</dt>
            <dd>{formatDate(meeting.occurred_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--ff-text-muted)]">Duration</dt>
            <dd>{formatDuration(meeting.duration_ms)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--ff-text-muted)]">Participants</dt>
            <dd>{meeting.participants.join(", ") || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--ff-text-muted)]">Source</dt>
            <dd>Workspace recording (seeded demo)</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
