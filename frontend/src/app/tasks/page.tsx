"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { fetchAllTasks } from "@/lib/api/workspace";
import { cn } from "@/lib/utils";

const filters = [
  { id: "open" as const, label: "Open" },
  { id: "done" as const, label: "Completed" },
  { id: "all" as const, label: "All" },
];

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", "all"],
    queryFn: () => fetchAllTasks(true),
  });

  const openCount = data?.filter((t) => !t.is_completed).length ?? 0;

  return (
    <AppShell
      title="Tasks"
      subtitle={data ? `${openCount} open · ${data.length} total` : "Action items across meetings"}
    >
      <div className="mb-4 flex gap-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-violet-100 text-violet-800"
                : "text-zinc-600 hover:bg-zinc-100"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      {isLoading && <p className="text-sm text-zinc-500">Loading tasks…</p>}
      {isError && (
        <p className="text-sm text-red-600">Could not load tasks. Is the API running?</p>
      )}
      {data && <TaskBoard tasks={data} filter={filter} />}
    </AppShell>
  );
}
