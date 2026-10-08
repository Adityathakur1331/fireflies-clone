"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  LayoutGrid,
  Plug,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/meetings", label: "Meetings", icon: LayoutGrid },
  { href: "/settings#integrations", label: "Integrations", icon: Plug, placeholder: true },
];

const secondaryNav = [{ href: "/settings", label: "Settings", icon: Settings }];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-[220px] shrink-0 flex-col border-r border-black/20 bg-[var(--ff-sidebar)] text-zinc-200 md:flex"
    >
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-white">
          <Sparkles className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Workspace</p>
          <p className="text-[11px] text-zinc-400">Meeting intelligence</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2" aria-label="Main">
        {mainNav.map(({ href, label, icon: Icon, placeholder }) => {
          const active = !placeholder && pathname.startsWith(href.split("#")[0]);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-[var(--ff-sidebar-active)] text-white"
                  : "text-zinc-300 hover:bg-[var(--ff-sidebar-hover)] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {label}
              {placeholder && (
                <span className="ml-auto text-[10px] font-normal text-zinc-500">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-2 py-2">
        <div className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-[12px] text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          Calendar sync
          <span className="ml-auto text-[10px]">Soon</span>
        </div>
        <div className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-[12px] text-zinc-500">
          <Users className="h-3.5 w-3.5" />
          Team
          <span className="ml-auto text-[10px]">Soon</span>
        </div>
        {secondaryNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-[var(--ff-sidebar-active)] text-white"
                : "text-zinc-300 hover:bg-[var(--ff-sidebar-hover)]"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-semibold text-violet-200">
            DU
          </span>
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-zinc-200">Demo User</p>
            <p className="truncate text-zinc-500">demo@workspace.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
