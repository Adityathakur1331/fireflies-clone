"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { fetchAllTasks } from "@/lib/api/workspace";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const filters = [
  { id: "open" as const, label: "My Tasks" },
  { id: "all" as const, label: "All Tasks" },
  { id: "done" as const, label: "Completed" },
];

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", "all"],
    queryFn: () => fetchAllTasks(true),
  });

  const openCount = data?.filter((t) => !t.is_completed).length ?? 0;
  const listFilter = filter === "open" ? "open" : filter === "done" ? "done" : "all";

  return (
    <AppShell
      title="Tasks"
      subtitle={data ? `${openCount} open` : undefined}
      searchPlaceholder="Search by title or keyword"
    >
      <div className="mb-4 flex gap-1 rounded-md border border-[var(--ff-border)] p-0.5 w-fit">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium",
              filter === f.id
                ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                : "text-[var(--ff-text-secondary)] hover:text-[var(--ff-text)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4 ff-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-[var(--ff-text-secondary)]">
          Automatically send tasks to work apps —{" "}
          <span className="text-[var(--ff-accent-muted)]">Connect (demo)</span>
        </p>
      </div>

      {isLoading && <p className="text-sm text-[var(--ff-text-muted)]">Loading tasks…</p>}
      {isError && (
        <div className="ff-panel border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
          Could not load tasks from <code className="text-red-200">/api/tasks</code>.
          <br />
          {error instanceof ApiError
            ? `${error.message} (${error.status})`
            : (error as Error)?.message}
        </div>
      )}
      {data && <TaskBoard tasks={data} filter={listFilter} />}
    </AppShell>
  );
}
