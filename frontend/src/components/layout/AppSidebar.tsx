"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic2, Settings, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-5">
        <Mic2 className="h-6 w-6 text-violet-400" />
        <div>
          <p className="text-sm font-semibold">Northstar Notes</p>
          <p className="text-xs text-slate-400">Meeting workspace</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              pathname.startsWith(href)
                ? "bg-violet-600/20 text-violet-200"
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
