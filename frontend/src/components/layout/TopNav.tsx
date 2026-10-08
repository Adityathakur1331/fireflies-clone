"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutGrid, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function TopNav({
  title,
  subtitle,
  actions,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--ff-border)] bg-white/95 backdrop-blur-sm">
      <div className="flex h-12 items-center justify-between gap-3 px-4 md:px-5">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold text-zinc-900">
            {title ?? "Meetings"}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="flex items-center gap-1.5 rounded-md border border-[var(--ff-border)] px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            aria-label="Account menu"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">
              DU
            </span>
            <span className="hidden sm:inline">Demo User</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-md border border-[var(--ff-border)] bg-white p-1 shadow-lg"
              sideOffset={6}
            >
              <DropdownMenu.Item className="cursor-default rounded px-3 py-2 text-xs text-zinc-500 outline-none">
                Profile (placeholder)
              </DropdownMenu.Item>
              <DropdownMenu.Item className="cursor-default rounded px-3 py-2 text-xs text-zinc-500 outline-none">
                Sign out (placeholder)
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <nav className="flex gap-1 border-t border-zinc-100 px-2 py-1.5 md:hidden" aria-label="Mobile">
        <Link
          href="/meetings"
          className={cn(
            "flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium",
            pathname.startsWith("/meetings")
              ? "bg-violet-100 text-violet-800"
              : "text-zinc-600"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Meetings
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium",
            pathname === "/settings" ? "bg-violet-100 text-violet-800" : "text-zinc-600"
          )}
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Link>
      </nav>
    </header>
  );
}
