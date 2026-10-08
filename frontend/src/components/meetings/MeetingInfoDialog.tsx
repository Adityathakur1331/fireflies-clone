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
            <dt className="text-xs font-medium text-zinc-500">Title</dt>
            <dd className="font-medium text-zinc-900">{meeting.title}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">Date</dt>
            <dd>{formatDate(meeting.occurred_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">Duration</dt>
            <dd>{formatDuration(meeting.duration_ms)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">Participants</dt>
            <dd>{meeting.participants.join(", ") || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500">Source</dt>
            <dd>Workspace recording (seeded demo)</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
