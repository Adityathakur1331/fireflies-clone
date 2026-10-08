"use client";

import { Clock, Users } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import type { MeetingDetail } from "@/types/meeting";
import { formatDate, formatDuration } from "@/lib/utils";
import { speakerColorClass, speakerInitials } from "@/lib/speaker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { DeleteMeetingDialog } from "./DeleteMeetingDialog";

export function MeetingHeader({ meeting }: { meeting: MeetingDetail }) {
  const copyLink = () => {
    const url = `${window.location.origin}/meetings/${meeting.id}`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success("Meeting link copied"),
      () => toast.error("Could not copy link")
    );
  };

  return (
    <header className="mb-4 border-b border-[var(--ff-border)] pb-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="ff-section-label mb-1">Meeting notebook</p>
          <h1 className="text-lg font-semibold tracking-tight text-[var(--ff-text)] md:text-xl">
            {meeting.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--ff-text-secondary)]">
            <span>{formatDate(meeting.occurred_at)}</span>
            <span className="inline-flex items-center gap-1 text-[var(--ff-text-muted)]">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatDuration(meeting.duration_ms)}
            </span>
            {meeting.media_type && (
              <span className="rounded bg-[var(--ff-surface-elevated)] px-2 py-0.5 text-xs font-medium text-[var(--ff-text-secondary)]">
                {meeting.media_type === "video" ? "Video" : "Audio"} recording
              </span>
            )}
          </div>
          {meeting.summary_gist && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ff-text-secondary)]">
              {meeting.summary_gist}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Users className="h-4 w-4 text-[var(--ff-text-muted)]" aria-hidden />
            <div className="flex flex-wrap items-center gap-2">
              {meeting.participants.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] px-2 py-0.5 text-xs text-[var(--ff-text-secondary)]"
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold",
                      speakerColorClass(p.display_name)
                    )}
                  >
                    {speakerInitials(p.display_name)}
                  </span>
                  {p.display_name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <EditMeetingDialog meeting={meeting} />
          <Button variant="outline" size="sm" type="button" onClick={copyLink}>
            Share link
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" size="sm" type="button" aria-label="More actions">
                More
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
      </div>
    </header>
  );
}
