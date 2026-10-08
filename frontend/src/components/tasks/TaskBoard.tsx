"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ExternalLink } from "lucide-react";
import type { TaskWithMeeting } from "@/lib/api/workspace";
import { deleteActionItem, updateActionItem } from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export function TaskBoard({
  tasks,
  filter,
}: {
  tasks: TaskWithMeeting[];
  filter: "all" | "open" | "done";
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["workspace-stats"] });
  };

  const filtered = tasks.filter((t) => {
    if (filter === "open") return !t.is_completed;
    if (filter === "done") return t.is_completed;
    return true;
  });

  const toggleMutation = useMutation({
    mutationFn: ({ meetingId, id, done }: { meetingId: number; id: number; done: boolean }) =>
      updateActionItem(meetingId, id, { is_completed: done }),
    onSuccess: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: ({
      meetingId,
      id,
      title,
    }: {
      meetingId: number;
      id: number;
      title: string;
    }) => updateActionItem(meetingId, id, { title }),
    onSuccess: () => {
      toast.success("Task updated");
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ meetingId, id }: { meetingId: number; id: number }) =>
      deleteActionItem(meetingId, id),
    onSuccess: () => {
      toast.success("Task removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!filtered.length) {
    return (
      <div className="ff-panel px-6 py-14 text-center text-sm text-zinc-500">
        No tasks in this view.
      </div>
    );
  }

  return (
    <div className="ff-panel overflow-hidden">
      <ul className="divide-y divide-[var(--ff-border)]">
        {filtered.map((t) => (
          <li key={t.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Checkbox.Root
                checked={t.is_completed}
                onCheckedChange={(v) =>
                  toggleMutation.mutate({
                    meetingId: t.meeting_id,
                    id: t.id,
                    done: v === true,
                  })
                }
                className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                aria-label={`Complete ${t.title}`}
              >
                <Checkbox.Indicator>
                  <Check className="h-3 w-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div className="min-w-0 flex-1">
                {editingId === t.id ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      aria-label="Edit task"
                    />
                    <Button
                      size="sm"
                      disabled={!editingTitle.trim() || editMutation.isPending}
                      onClick={() =>
                        editMutation.mutate({
                          meetingId: t.meeting_id,
                          id: t.id,
                          title: editingTitle.trim(),
                        })
                      }
                    >
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p
                      className={
                        t.is_completed
                          ? "text-sm text-zinc-400 line-through"
                          : "text-sm font-medium text-zinc-900"
                      }
                    >
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {t.assignee ? `${t.assignee} · ` : ""}
                      {formatDate(t.meeting_occurred_at)}
                    </p>
                    <Link
                      href={`/meetings/${t.meeting_id}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-700 hover:underline"
                    >
                      {t.meeting_title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </>
                )}
              </div>
            </div>
            {editingId !== t.id && (
              <div className="flex gap-1 pl-7 sm:pl-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setEditingId(t.id);
                    setEditingTitle(t.title);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-600"
                  onClick={() =>
                    deleteMutation.mutate({ meetingId: t.meeting_id, id: t.id })
                  }
                >
                  Delete
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
