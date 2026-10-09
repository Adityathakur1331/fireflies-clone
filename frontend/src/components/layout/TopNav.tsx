"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { bottomNav, mobileNav, primaryNav, productNav } from "./nav-config";
import { WorkspaceSearch } from "./WorkspaceSearch";
import { CaptureMenu } from "./CaptureMenu";

export function TopNav({
  title,
  actions,
  searchPlaceholder,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
}) {
  const pathname = usePathname();

  return (
    <header className="shrink-0 border-b border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)]">
      <div className="flex h-12 items-center gap-2 px-3 md:gap-4 md:px-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--ff-border)] text-[var(--ff-text-secondary)] md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 max-h-[70vh] w-56 overflow-y-auto rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-1 shadow-xl"
              sideOffset={6}
            >
              {[...primaryNav, ...productNav, ...bottomNav].map(({ href, label }) => (
                <DropdownMenu.Item key={href} asChild>
                  <Link
                    href={href}
                    className="flex cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    {label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <h1 className="shrink-0 text-sm font-semibold text-[var(--ff-text)] md:min-w-[100px]">
          {title ?? "Home"}
        </h1>

        <div className="hidden min-w-0 flex-1 md:block">
          <WorkspaceSearch placeholder={searchPlaceholder} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {actions}
          <span
            className="hidden items-center gap-1 rounded-full border border-[var(--ff-success-muted)] bg-[var(--ff-success-muted)]/30 px-2 py-0.5 text-[11px] font-medium text-[var(--ff-success)] sm:inline-flex"
          >
            6 meetings
          </span>
          <Link
            href="/analytics"
            className="hidden rounded-md border border-[var(--ff-success)]/40 px-2.5 py-1 text-xs font-medium text-[var(--ff-success)] hover:bg-[var(--ff-success)]/10 sm:inline-block"
          >
            Upgrade
          </Link>
          <button
            type="button"
            className="relative hidden h-8 w-8 items-center justify-center rounded-md text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)] sm:flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <CaptureMenu />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="flex items-center gap-1 rounded-md px-1 py-1 hover:bg-[var(--ff-sidebar-hover)]"
              aria-label="Account menu"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--ff-accent)] text-[11px] font-bold text-white">
                A
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[var(--ff-text-muted)] sm:block" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[200px] rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-1 shadow-xl"
                sideOffset={6}
                align="end"
              >
                <DropdownMenu.Item className="cursor-default rounded px-3 py-2 text-xs text-[var(--ff-text-muted)] outline-none">
                  Demo workspace
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link
                    href="/settings"
                    className="cursor-pointer rounded px-3 py-2 text-sm text-[var(--ff-text)] outline-none hover:bg-[var(--ff-sidebar-hover)]"
                  >
                    Settings
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      <div className="border-t border-[var(--ff-border-subtle)] px-3 py-2 md:hidden">
        <WorkspaceSearch placeholder={searchPlaceholder} />
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-[var(--ff-border-subtle)] px-2 py-1.5 md:hidden"
        aria-label="Mobile shortcuts"
      >
        {mobileNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium",
              pathname === href || pathname.startsWith(`${href}/`)
                ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                : "text-[var(--ff-text-secondary)]"
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
