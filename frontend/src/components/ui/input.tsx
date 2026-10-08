import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] px-3 py-1 text-sm text-[var(--ff-text)] shadow-sm transition-colors placeholder:text-[var(--ff-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ff-accent)]",
        className
      )}
      {...props}
    />
  );
}
