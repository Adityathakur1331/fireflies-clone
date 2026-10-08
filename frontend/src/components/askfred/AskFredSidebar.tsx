"use client";

import { MessageSquarePlus, Plug, Search } from "lucide-react";
export function AskFredSidebar() {
  return (
    <aside
      className="hidden w-[200px] shrink-0 flex-col border-r border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] md:flex"
      aria-label="AskFred"
    >
      <nav className="flex flex-col gap-0.5 p-2">
        <button type="button" className="ff-subnav-item ff-subnav-item-active">
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </button>
        <button type="button" className="ff-subnav-item">
          <Search className="h-4 w-4" />
          Search
        </button>
        <button type="button" className="ff-subnav-item">
          <Plug className="h-4 w-4" />
          Connectors
        </button>
      </nav>
      <div className="mt-4 px-3">
        <p className="text-xs font-medium text-[var(--ff-text-muted)]">No chats yet</p>
        <p className="mt-1 text-[11px] text-[var(--ff-text-muted)]">
          Your chats will appear here once you start one.
        </p>
        <div className="mt-3 space-y-2 opacity-40">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded-md bg-[var(--ff-surface-elevated)]" />
          ))}
        </div>
      </div>
    </aside>
  );
}
