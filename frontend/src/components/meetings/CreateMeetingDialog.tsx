"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateMeetingDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [transcriptRaw, setTranscriptRaw] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createMeeting({
        title,
        occurred_at: new Date().toISOString(),
        participants: participants
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((display_name) => ({ display_name })),
        transcript_raw: transcriptRaw || undefined,
      }),
    onSuccess: (meeting) => {
      toast.success("Meeting created");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setOpen(false);
      setTitle("");
      setParticipants("");
      setTranscriptRaw("");
      router.push(`/meetings/${meeting.id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New meeting</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Weekly product sync"
            />
          </div>
          <div>
            <Label htmlFor="participants">Participants (comma-separated)</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Alex, Rina, Dana"
            />
          </div>
          <div>
            <Label htmlFor="transcript">Transcript paste (optional)</Label>
            <textarea
              id="transcript"
              className="mt-1 min-h-[120px] w-full rounded-md border border-slate-200 p-2 text-sm"
              value={transcriptRaw}
              onChange={(e) => setTranscriptRaw(e.target.value)}
              placeholder="[00:00:05] Alex: Hello team..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Format: [HH:MM:SS] Speaker: text
            </p>
          </div>
          <Button
            className="w-full"
            disabled={!title || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
