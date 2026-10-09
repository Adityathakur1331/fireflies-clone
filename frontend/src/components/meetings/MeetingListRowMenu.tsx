"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import type { MeetingListItem } from "@/types/meeting";
import { fetchMeeting } from "@/lib/api/meetings";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { DeleteMeetingDialog } from "./DeleteMeetingDialog";
import { MeetingInfoDialog } from "./MeetingInfoDialog";

export function MeetingListRowMenu({ meeting }: { meeting: MeetingListItem }) {
  const router = useRouter();
  const [infoOpen, setInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const detailQuery = useQuery({
    queryKey: ["meeting", meeting.id, "edit"],
    queryFn: () => fetchMeeting(meeting.id),
    enabled: editOpen,
  });

  const copyLink = () => {
    const url = `${window.location.origin}/meetings/${meeting.id}`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied"),
      () => toast.error("Could not copy link")
    );
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="rounded-md p-1.5 text-[var(--ff-text-muted)] opacity-0 transition-opacity hover:bg-[var(--ff-sidebar-hover)] hover:text-[var(--ff-text)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 group-hover:opacity-100 data-[state=open]:opacity-100"
          aria-label={`Actions for ${meeting.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
              className="z-50 min-w-[180px] rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-1 shadow-xl"
            sideOffset={4}
            align="end"
          >
            <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => router.push(`/meetings/${meeting.id}`)}
            >
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => setEditOpen(true)}
            >
              Rename / edit
            </DropdownMenu.Item>
            <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => setInfoOpen(true)}
            >
              Meeting info
            </DropdownMenu.Item>
            <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={copyLink}
            >
              Copy link
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-[var(--ff-border)]" />
            <DropdownMenu.Item asChild onSelect={(e) => e.preventDefault()}>
              <DeleteMeetingDialog
                meetingId={meeting.id}
                triggerClassName="w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-red-600 outline-none hover:bg-red-50"
                triggerLabel="Delete"
              />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <MeetingInfoDialog meeting={meeting} open={infoOpen} onOpenChange={setInfoOpen} />

      {editOpen && detailQuery.data && (
        <EditMeetingDialog
          meeting={detailQuery.data}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}
