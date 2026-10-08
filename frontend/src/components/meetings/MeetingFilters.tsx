"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FilterState {
  q: string;
  participant: string;
  date_from: string;
  date_to: string;
}

const emptyFilters: FilterState = {
  q: "",
  participant: "",
  date_from: "",
  date_to: "",
};

export function MeetingFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const hasActiveFilters = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="ff-panel p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--ff-text-secondary)]">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
        Filter meetings
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-xs text-[var(--ff-text-muted)]">Search</Label>
          <div className="relative mt-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ff-text-muted)]"
              aria-hidden
            />
            <Input
              className="h-8 pl-8 text-sm"
              placeholder="Title or participant"
              value={filters.q}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-[var(--ff-text-muted)]">Participant</Label>
          <Input
            className="mt-1 h-8 text-sm"
            placeholder="Name contains…"
            value={filters.participant}
            onChange={(e) => onChange({ ...filters, participant: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs text-[var(--ff-text-muted)]">From</Label>
          <Input
            className="mt-1 h-8 text-sm"
            type="date"
            value={filters.date_from}
            onChange={(e) => onChange({ ...filters, date_from: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs text-[var(--ff-text-muted)]">To</Label>
          <Input
            className="mt-1 h-8 text-sm"
            type="date"
            value={filters.date_to}
            onChange={(e) => onChange({ ...filters, date_to: e.target.value })}
          />
        </div>
      </div>
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 h-7 text-xs"
          onClick={() => onChange(emptyFilters)}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
