"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

export function EditMeetingDialog({ meeting }: { meeting: MeetingDetail }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [participants, setParticipants] = useState(
    meeting.participants.map((p) => p.display_name).join(", ")
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    setTitle(meeting.title);
    setParticipants(meeting.participants.map((p) => p.display_name).join(", "));
  }, [meeting]);

  const mutation = useMutation({
    mutationFn: () =>
      updateMeeting(meeting.id, {
        title,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Participants</Label>
            <Input value={participants} onChange={(e) => setParticipants(e.target.value)} />
          </div>
          <Button
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
