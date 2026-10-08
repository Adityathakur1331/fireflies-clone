import { AppShell } from "@/components/layout/AppShell";
import { Calendar, MessageSquare, Video } from "lucide-react";

const integrations = [
  { name: "Google Meet", category: "Conferencing", icon: Video },
  { name: "Zoom", category: "Conferencing", icon: Video },
  { name: "Google Calendar", category: "Calendar", icon: Calendar },
  { name: "Slack", category: "Collaboration", icon: MessageSquare },
  { name: "Salesforce", category: "CRM", icon: MessageSquare },
  { name: "HubSpot", category: "CRM", icon: MessageSquare },
];

export default function IntegrationsPage() {
  return (
    <AppShell title="Integrations" subtitle="Connect your meeting stack">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <article
            key={i.name}
            className="ff-panel flex items-start gap-3 p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <i.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">{i.name}</h2>
              <p className="text-xs text-zinc-500">{i.category}</p>
              <p className="mt-2 text-xs font-medium text-zinc-400">Coming soon</p>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
