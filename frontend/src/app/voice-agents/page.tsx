import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceAgentsPage() {
  return (
    <AppShell title="Voice Agents" subtitle="Autonomous meeting assistants">
      <div className="mx-auto max-w-lg ff-panel px-6 py-14 text-center">
        <Mic className="mx-auto h-10 w-10 text-[var(--ff-accent-muted)]" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-[var(--ff-text)]">
          Voice agents are coming soon
        </h2>
        <p className="mt-2 text-sm text-[var(--ff-text-secondary)]">
          Deploy agents that join calls, capture speakers, and route notes into your workspace.
          This assignment demo focuses on post-meeting intelligence.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/meetings">Review recorded meetings</Link>
        </Button>
      </div>
    </AppShell>
  );
}
