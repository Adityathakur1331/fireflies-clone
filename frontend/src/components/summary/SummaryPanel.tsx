"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ActionItem, SummaryResponse } from "@/types/meeting";
import {
  createActionItem,
  deleteActionItem,
  updateActionItem,
} from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTimestamp } from "@/lib/utils";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export function SummaryPanel({
  meetingId,
  summary,
  actionItems,
  onChapterClick,
}: {
  meetingId: number;
  summary: SummaryResponse;
  actionItems: ActionItem[];
  onChapterClick?: (startMs: number) => void;
}) {
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["action-items", meetingId] });
  };

  const addMutation = useMutation({
    mutationFn: () => createActionItem(meetingId, { title: newTask }),
    onSuccess: () => {
      toast.success("Action item added");
      setNewTask("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, done }: { id: number; done: boolean }) =>
      updateActionItem(meetingId, id, { is_completed: done }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteActionItem(meetingId, id),
    onSuccess: () => {
      toast.success("Action item removed");
      invalidate();
    },
  });

  return (
    <div className="space-y-6 overflow-y-auto p-4">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Overview</h3>
        <p className="text-sm leading-relaxed text-slate-700">{summary.overview}</p>
        {summary.gist && (
          <p className="mt-2 text-sm font-medium text-violet-800">{summary.gist}</p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Key topics</h3>
        <ul className="flex flex-wrap gap-2">
          {summary.key_topics.map((t) => (
            <li
              key={t}
              className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Chapters</h3>
        <ul className="space-y-2">
          {summary.chapters.map((ch) => (
            <li key={ch.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => onChapterClick?.(ch.start_ms)}
              >
                <span>{ch.title}</span>
                <span className="font-mono text-xs text-slate-500">
                  {formatTimestamp(ch.start_ms)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Action items</h3>
        <ul className="space-y-2">
          {actionItems.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2"
            >
              <Checkbox.Root
                checked={item.is_completed}
                onCheckedChange={(v) =>
                  toggleMutation.mutate({ id: item.id, done: v === true })
                }
                className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-slate-300 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
              >
                <Checkbox.Indicator>
                  <Check className="h-3 w-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div className="flex-1">
                <p
                  className={
                    item.is_completed ? "text-sm text-slate-400 line-through" : "text-sm"
                  }
                >
                  {item.title}
                </p>
                {item.assignee && (
                  <p className="text-xs text-slate-500">{item.assignee}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="New action item..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button
            disabled={!newTask.trim() || addMutation.isPending}
            onClick={() => addMutation.mutate()}
          >
            Add
          </Button>
        </div>
      </section>
    </div>
  );
}
