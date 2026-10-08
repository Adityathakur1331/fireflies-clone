"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { bottomNav, mobileNav, primaryNav, productNav } from "./nav-config";

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
      <div className="flex h-12 items-center justify-between gap-2 px-3 md:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--ff-border)] text-zinc-600 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 max-h-[70vh] w-56 overflow-y-auto rounded-md border border-[var(--ff-border)] bg-white p-1 shadow-lg"
                sideOffset={6}
              >
                {[...primaryNav, ...productNav, ...bottomNav].map(({ href, label, soon }) => (
                  <DropdownMenu.Item key={href} asChild>
                    <Link
                      href={href}
                      className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm outline-none hover:bg-zinc-50"
                    >
                      {label}
                      {soon && <span className="text-[10px] text-zinc-400">Soon</span>}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold text-zinc-900">
              {title ?? "Workspace"}
            </h1>
            {subtitle && (
              <p className="truncate text-xs text-zinc-500">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="flex items-center gap-1.5 rounded-md border border-[var(--ff-border)] px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
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
      <nav
        className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-2 py-1.5 md:hidden"
        aria-label="Mobile shortcuts"
      >
        {mobileNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium",
              pathname === href || pathname.startsWith(`${href}/`)
                ? "bg-violet-100 text-violet-800"
                : "text-zinc-600"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
