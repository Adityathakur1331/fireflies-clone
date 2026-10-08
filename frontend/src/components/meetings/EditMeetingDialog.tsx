"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { updateMeeting } from "@/lib/api/meetings";
import type { MeetingDetail } from "@/types/meeting";
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

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditMeetingDialog({
  meeting,
  open: controlledOpen,
  onOpenChange,
}: {
  meeting: MeetingDetail;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [title, setTitle] = useState(meeting.title);
  const [participants, setParticipants] = useState(
    meeting.participants.map((p) => p.display_name).join(", ")
  );
  const [occurredAtLocal, setOccurredAtLocal] = useState(toDatetimeLocalValue(meeting.occurred_at));
  const queryClient = useQueryClient();

  useEffect(() => {
    setTitle(meeting.title);
    setParticipants(meeting.participants.map((p) => p.display_name).join(", "));
    setOccurredAtLocal(toDatetimeLocalValue(meeting.occurred_at));
  }, [meeting]);

  const mutation = useMutation({
    mutationFn: () =>
      updateMeeting(meeting.id, {
        title,
        occurred_at: new Date(occurredAtLocal).toISOString(),
        participants: participants
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((display_name) => ({ display_name })),
      }),
    onSuccess: () => {
      toast.success("Meeting updated");
      queryClient.invalidateQueries({ queryKey: ["meeting", meeting.id] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const showTrigger = controlledOpen === undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-date">Date &amp; time</Label>
            <Input
              id="edit-date"
              type="datetime-local"
              value={occurredAtLocal}
              onChange={(e) => setOccurredAtLocal(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-participants">Participants</Label>
            <Input
              id="edit-participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={!title.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
