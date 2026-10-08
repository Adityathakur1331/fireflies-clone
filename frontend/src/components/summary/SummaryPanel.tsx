"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
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
    onError: (e: Error) => toast.error(e.message),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      updateActionItem(meetingId, id, { title }),
    onSuccess: () => {
      toast.success("Action item updated");
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="h-full space-y-0 overflow-y-auto">
      <section className="border-b border-[var(--ff-border)] px-4 py-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
          <h3 className="text-sm font-semibold text-[var(--ff-text)]">AI Summary</h3>
          <span className="rounded bg-[var(--ff-accent)]/20 px-1.5 py-0.5 text-[10px] font-medium text-[var(--ff-accent-muted)]">
            Seeded
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--ff-text-secondary)]">
          {summary.overview ?? "No overview available."}
        </p>
        {summary.gist && (
          <p className="mt-3 border-l-2 border-violet-300 pl-3 text-sm font-medium text-zinc-800">
            {summary.gist}
          </p>
        )}
      </section>

      <section className="border-b border-[var(--ff-border)] px-4 py-4">
        <h3 className="ff-section-label mb-2">Key topics</h3>
        <ul className="flex flex-wrap gap-1.5">
          {summary.key_topics.map((t) => (
            <li
              key={t}
              className="rounded-md border border-violet-100 bg-violet-50/80 px-2.5 py-1 text-xs font-medium text-violet-900"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-b border-[var(--ff-border)] px-4 py-4">
        <h3 className="ff-section-label mb-2">Meeting notes</h3>
        <p className="text-sm leading-relaxed text-zinc-600">
          Structured notes are derived from the seeded summary above. Connect a live notetaker
          for real-time capture (coming soon).
        </p>
      </section>

      <section className="border-b border-[var(--ff-border)] px-4 py-4">
        <h3 className="ff-section-label mb-2">Chapters</h3>
        <ul className="space-y-1">
          {summary.chapters.map((ch) => (
            <li key={ch.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50"
                onClick={() => onChapterClick?.(ch.start_ms)}
              >
                <span className="pr-2">{ch.title}</span>
                <span className="shrink-0 font-mono text-[11px] text-violet-700">
                  {formatTimestamp(ch.start_ms)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 py-4">
        <h3 className="ff-section-label mb-3">Action items</h3>
        {actionItems.length === 0 && (
          <p className="mb-3 text-sm text-zinc-500">No action items yet. Add one below.</p>
        )}
        <ul className="space-y-2">
          {actionItems.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-md border border-[var(--ff-border)] bg-white px-3 py-2"
            >
              <Checkbox.Root
                checked={item.is_completed}
                onCheckedChange={(v) =>
                  toggleMutation.mutate({ id: item.id, done: v === true })
                }
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white"
                aria-label={`Mark ${item.title} complete`}
              >
                <Checkbox.Indicator>
                  <Check className="h-3 w-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div className="min-w-0 flex-1">
                {editingId === item.id ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      aria-label="Edit action item title"
                    />
                    <Button
                      size="sm"
                      disabled={!editingTitle.trim() || editMutation.isPending}
                      onClick={() =>
                        editMutation.mutate({ id: item.id, title: editingTitle.trim() })
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
                        item.is_completed
                          ? "text-sm text-zinc-400 line-through"
                          : "text-sm text-zinc-800"
                      }
                    >
                      {item.title}
                    </p>
                    {item.assignee && (
                      <p className="text-xs text-zinc-500">Owner: {item.assignee}</p>
                    )}
                  </>
                )}
              </div>
              {editingId !== item.id && (
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditingTitle(item.title);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add an action item..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            aria-label="New action item"
          />
          <Button
            className="shrink-0"
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
