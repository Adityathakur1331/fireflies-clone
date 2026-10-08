import { AppShell } from "@/components/layout/AppShell";
import { Bell, Palette, Plug, User, Users } from "lucide-react";

const sections = [
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Name, email, and avatar preferences.",
    status: "Demo profile is fixed for this assignment build.",
  },
  {
    id: "workspace",
    icon: Users,
    title: "Workspace",
    description: "Team name, default language, and retention.",
    status: "Coming soon",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Email digests and meeting-ready alerts.",
    status: "Coming soon",
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Theme and density for the notebook.",
    status: "Coming soon",
  },
  {
    id: "integrations",
    icon: Plug,
    title: "Integrations",
    description: "Connect Google Calendar, Zoom, Google Meet, and CRM tools.",
    status: "Coming soon",
  },
];

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Workspace preferences">
      <div className="mx-auto max-w-2xl space-y-3">
        {sections.map(({ id, icon: Icon, title, description, status }) => (
          <section
            key={id}
            id={id}
            className="ff-panel flex gap-4 p-4"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700"
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
              <p className="mt-0.5 text-sm text-zinc-600">{description}</p>
              <p className="mt-2 text-xs font-medium text-zinc-500">{status}</p>
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
