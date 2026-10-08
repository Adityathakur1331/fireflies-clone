"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteMeeting } from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteMeetingDialog({ meetingId }: { meetingId: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      toast.success("Meeting deleted");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setOpen(false);
      router.push("/meetings");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete meeting?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          This removes the transcript, summary, and action items permanently.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
