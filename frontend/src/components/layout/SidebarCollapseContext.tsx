"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "ff-sidebar-collapsed";

type SidebarCollapseContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(
  null
);

export function SidebarCollapseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /** Fireflies uses a compact icon rail by default. */
  const [collapsed, setCollapsedState] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "0") setCollapsedState(false);
      else if (stored === "1") setCollapsedState(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle, setCollapsed]
  );

  return (
    <SidebarCollapseContext.Provider value={value}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse() {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) {
    throw new Error("useSidebarCollapse must be used within SidebarCollapseProvider");
  }
  return ctx;
}
