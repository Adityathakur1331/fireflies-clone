"use client";

import { Clock } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import type { MeetingDetail } from "@/types/meeting";
import { formatDate, formatDuration } from "@/lib/utils";
import { getMeetingCaptureSource } from "@/lib/meetingCaptureSource";
import { Button } from "@/components/ui/button";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { DeleteMeetingDialog } from "./DeleteMeetingDialog";

export function NotepadToolbar({ meeting }: { meeting: MeetingDetail }) {
  const capture = getMeetingCaptureSource(meeting.id);
  const CaptureIcon = capture.icon;

  const copyLink = () => {
    const url = `${window.location.origin}/meetings/${meeting.id}`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success("Meeting link copied"),
      () => toast.error("Could not copy link")
    );
  };

  return (
    <header
      className="flex flex-col gap-3 border-b border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] px-3 py-2.5 md:flex-row md:items-center md:justify-between md:px-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-[var(--ff-text-muted)]">
          <CaptureIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{capture.label}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(meeting.occurred_at)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {formatDuration(meeting.duration_ms)}
          </span>
        </div>
        <h1 className="mt-1 truncate text-base font-semibold text-[var(--ff-text)] md:text-lg">
          {meeting.title}
        </h1>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" type="button" onClick={copyLink}>
          Share
        </Button>
        <EditMeetingDialog meeting={meeting} />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm" type="button" aria-label="More actions">
              ⋯
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[180px] rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-1 shadow-xl"
              sideOffset={4}
              align="end"
            >
              <DropdownMenu.Item
                className="cursor-default rounded px-3 py-2 text-sm text-[var(--ff-text-muted)] outline-none"
                onSelect={(e) => e.preventDefault()}
              >
                AI Skills — coming soon
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-default rounded px-3 py-2 text-sm text-[var(--ff-text-muted)] outline-none"
                onSelect={(e) => e.preventDefault()}
              >
                Export — coming soon
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-[var(--ff-border)]" />
              <DropdownMenu.Item asChild onSelect={(e) => e.preventDefault()}>
                <DeleteMeetingDialog
                  meetingId={meeting.id}
                  triggerClassName="w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-red-400 outline-none hover:bg-red-950/40"
                  triggerLabel="Delete meeting"
                />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
