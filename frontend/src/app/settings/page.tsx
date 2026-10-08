"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceSearch } from "@/components/layout/WorkspaceSearch";
import { cn } from "@/lib/utils";
import {
  Bell,
  Palette,
  Shield,
  Sparkles,
  Video,
} from "lucide-react";

const settingsNav = [
  { id: "appearance", label: "Language & Appearance", icon: Palette },
  { id: "recording", label: "Recording & Privacy", icon: Video },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI Settings", icon: Sparkles },
  { id: "security", label: "Security overview", icon: Shield },
];

export default function SettingsPage() {
  const [section, setSection] = useState("recording");
  const [scope, setScope] = useState<"personal" | "team">("personal");

  return (
    <AppShell title="Settings" flush searchPlaceholder="Search settings">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] md:flex">
          <div className="border-b border-[var(--ff-border-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--ff-text)]">Aditya</p>
            <p className="text-xs text-[var(--ff-text-muted)]">demo@workspace.local · Free plan</p>
            <div className="mt-3 flex rounded-md border border-[var(--ff-border)] p-0.5">
              <button
                type="button"
                onClick={() => setScope("personal")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  scope === "personal"
                    ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-muted)]"
                )}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setScope("team")}
                className={cn(
                  "flex-1 rounded px-2 py-1 text-xs font-medium",
                  scope === "team"
                    ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-muted)]"
                )}
              >
                Team
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {settingsNav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={cn(
                  "ff-subnav-item",
                  section === id && "ff-subnav-item-active"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-[var(--ff-border-subtle)] p-3">
            <Link
              href="/integrations"
              className="text-xs text-[var(--ff-accent-muted)] hover:underline"
            >
              Integrations →
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6 md:hidden">
            <WorkspaceSearch placeholder="Search settings" className="max-w-none" />
          </div>

          <h2 className="text-lg font-semibold text-[var(--ff-text)] capitalize">
            {settingsNav.find((s) => s.id === section)?.label ?? "Settings"}
          </h2>
          <p className="mt-1 text-sm text-[var(--ff-text-secondary)]">
            {scope === "team"
              ? "Team settings are placeholders in this assignment build."
              : "Configure your workspace preferences (demo placeholders)."}
          </p>

          <div className="mt-6 space-y-6">
            <SettingsCard
              title="Auto-record meetings"
              description="Notetaker joins calendar events when connected."
              control={<TogglePlaceholder on />}
            />
            <SettingsCard
              title="Meeting language"
              description="For transcripts and summaries."
              control={
                <select
                  className="rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] px-3 py-2 text-sm text-[var(--ff-text)]"
                  defaultValue="en"
                >
                  <option value="en">English (Global)</option>
                </select>
              }
            />
            <SettingsCard
              title="Meeting privacy"
              description="Who can access notes and recordings."
              control={
                <select
                  className="rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] px-3 py-2 text-sm text-[var(--ff-text)]"
                  defaultValue="team"
                >
                  <option value="team">Teammates & anyone with link</option>
                </select>
              }
            />
            <SettingsCard
              title="Email notifications"
              description="Digest and meeting-ready alerts."
              control={<TogglePlaceholder />}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SettingsCard({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="ff-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--ff-text)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ff-text-muted)]">{description}</p>
      </div>
      {control}
    </div>
  );
}

function TogglePlaceholder({ on }: { on?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn(
        "h-6 w-11 rounded-full transition-colors",
        on ? "bg-[var(--ff-accent)]" : "bg-[var(--ff-border)]"
      )}
    >
      <span
        className={cn(
          "mt-0.5 block h-5 w-5 rounded-full bg-white transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
