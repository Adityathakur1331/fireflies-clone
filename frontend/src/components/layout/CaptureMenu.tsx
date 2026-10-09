"use client";

import { useState } from "react";
import { ChevronDown, Mic, Plus, Upload, Video } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";

export function CaptureMenu() {
  const [createOpen, setCreateOpen] = useState(false);

  const comingSoon = (label: string) => {
    toast.message("Coming soon", {
      description: `${label} is not available in this assignment demo.`,
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="capture" size="sm" className="h-8 gap-1 px-2.5">
            <Video className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Capture</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[220px] rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-1 shadow-xl"
            sideOffset={6}
            align="end"
          >
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => comingSoon("Add to live meeting")}
            >
              <Video className="mr-2 inline h-4 w-4 opacity-80" />
              Add to live meeting
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => comingSoon("Schedule new meeting")}
            >
              <Plus className="mr-2 inline h-4 w-4 opacity-80" />
              Schedule new meeting
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => setCreateOpen(true)}
            >
              <Upload className="mr-2 inline h-4 w-4 opacity-80" />
              Upload audio or video
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
              onSelect={() => comingSoon("Start recording")}
            >
              <Mic className="mr-2 inline h-4 w-4 opacity-80" />
              Start recording
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <CreateMeetingDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
