"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { bottomNav, primaryNav, productNav } from "./nav-config";

const railNav = [...primaryNav, ...productNav, ...bottomNav];

export function GlobalIconRail() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-[52px] shrink-0 flex-col items-center border-r border-[var(--ff-border-subtle)] bg-[var(--ff-sidebar)] py-2 md:flex"
      aria-label="Primary navigation"
    >
      <Link
        href="/home"
        className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--ff-accent)] text-xs font-bold text-white"
        title="ADITYA workspace"
      >
        A
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-1">
        {railNav.map(({ href, label, icon: Icon }) => {
          const base = href.split("#")[0];
          const active =
            pathname === base ||
            (base === "/home" && pathname === "/") ||
            (base !== "/home" && pathname.startsWith(base));
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md text-[var(--ff-text-secondary)] transition-colors",
                active &&
                  "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)] shadow-[inset_2px_0_0_0_var(--ff-accent)]"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
