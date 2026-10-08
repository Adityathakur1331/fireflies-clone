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

export function DeleteMeetingDialog({
  meetingId,
  triggerClassName,
  triggerLabel = "Delete",
}: {
  meetingId: number;
  triggerClassName?: string;
  triggerLabel?: string;
}) {
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

  const trigger = triggerClassName ? (
    <button type="button" className={triggerClassName}>
      {triggerLabel}
    </button>
  ) : (
    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
      {triggerLabel}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this meeting?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-zinc-600">
          This permanently removes the recording reference, transcript, AI summary, and action
          items. This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Deleting…" : "Delete meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
