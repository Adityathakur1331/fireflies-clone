"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, MoreHorizontal, Video } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import type { MeetingListItem } from "@/types/meeting";
import { formatDate, formatDuration } from "@/lib/utils";
import { speakerColorClass, speakerInitials } from "@/lib/speaker";
import { cn } from "@/lib/utils";

export function MeetingList({ meetings }: { meetings: MeetingListItem[] }) {
  if (!meetings.length) {
    return (
      <div className="ff-panel px-6 py-14 text-center">
        <p className="text-sm font-medium text-zinc-800">No meetings found</p>
        <p className="mt-1 text-sm text-zinc-500">
          Try adjusting search or filters, or create a new meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="ff-panel overflow-hidden">
      <ul className="divide-y divide-[var(--ff-border)]">
        {meetings.map((m) => (
          <MeetingRow key={m.id} meeting={m} />
        ))}
      </ul>
    </div>
  );
}

function MeetingRow({ meeting: m }: { meeting: MeetingListItem }) {
  const router = useRouter();

  const copyLink = () => {
    const url = `${window.location.origin}/meetings/${m.id}`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied"),
      () => toast.error("Could not copy link")
    );
  };

  return (
    <li className="group relative">
      <Link
        href={`/meetings/${m.id}`}
        className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-violet-50/50 sm:flex-row sm:items-center sm:gap-4 sm:py-3.5"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600"
            aria-hidden
          >
            <Video className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-zinc-900 group-hover:text-violet-800">
              {m.title}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
              <span>{formatDate(m.occurred_at)}</span>
              <span className="text-zinc-300">·</span>
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
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold",
                  speakerColorClass(p)
                )}
              >
                {speakerInitials(p)}
              </span>
            ))}
            {m.participants.length > 5 && (
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-[10px] font-medium text-zinc-600"
              >
                +{m.participants.length - 5}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2 sm:top-1/2 sm:-translate-y-1/2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="rounded-md p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-white hover:text-zinc-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 group-hover:opacity-100 data-[state=open]:opacity-100"
            aria-label={`Actions for ${m.title}`}
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
              className="z-50 min-w-[160px] rounded-md border border-[var(--ff-border)] bg-white p-1 shadow-lg"
              sideOffset={4}
              align="end"
            >
              <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-zinc-50"
                onSelect={() => router.push(`/meetings/${m.id}`)}
              >
                Open meeting
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-zinc-50"
                onSelect={copyLink}
              >
                Copy link
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </li>
  );
}
