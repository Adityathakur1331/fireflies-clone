"use client";

import { MessageSquarePlus, Plug, Search, Sparkles } from "lucide-react";
export function AskFredSidebar() {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-[var(--ff-border-subtle)] bg-[var(--ff-sidebar)] md:w-[52px] md:border-b-0 md:border-r"
      aria-label="AskFred tools"
    >
      <nav className="flex flex-row gap-1 p-2 md:flex-col md:gap-0.5">
        <button type="button" className="ff-askfred-rail-btn ff-askfred-rail-btn-active" title="New chat">
          <MessageSquarePlus className="h-4 w-4" />
          <span className="sr-only">New Chat</span>
        </button>
        <button type="button" className="ff-askfred-rail-btn" title="Search chats">
          <Search className="h-4 w-4" />
        </button>
        <button type="button" className="ff-askfred-rail-btn" title="Connectors (placeholder)">
          <Plug className="h-4 w-4" />
        </button>
      </nav>
    </aside>
  );
}

export function AskFredHistorySidebar() {
  return (
    <aside
      className="hidden w-[220px] shrink-0 flex-col border-r border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] md:flex"
      aria-label="Chat history"
    >
      <div className="border-b border-[var(--ff-border-subtle)] px-3 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--ff-accent-muted)]" />
          <span className="text-sm font-semibold text-[var(--ff-text)]">AskFred</span>
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-2 rounded-md border border-[var(--ff-border)] px-2 py-1.5 text-xs text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)]"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          New chat
        </button>
      </div>
      <div className="p-3">
        <p className="text-[11px] font-medium text-[var(--ff-text-muted)]">Today</p>
        <p className="mt-2 text-xs text-[var(--ff-text-muted)]">No saved chats in this demo.</p>
      </div>
    </aside>
  );
}
