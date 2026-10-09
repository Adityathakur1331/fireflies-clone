"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type WorkspaceSearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  /** Meetings page registers to receive global search submissions (ref only, no provider re-render). */
  registerMeetingsSearch: (handler: ((q: string) => void) | null) => void;
  applyMeetingsSearch: (q: string) => void;
};

const WorkspaceSearchContext = createContext<WorkspaceSearchContextValue | null>(
  null
);

function normalizeQuery(q: string | null | undefined): string {
  return q ?? "";
}

export function WorkspaceSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQueryState] = useState("");
  const meetingsHandlerRef = useRef<((q: string) => void) | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryState(normalizeQuery(q));
  }, []);

  const registerMeetingsSearch = useCallback(
    (handler: ((q: string) => void) | null) => {
      meetingsHandlerRef.current = handler;
    },
    []
  );

  const applyMeetingsSearch = useCallback((q: string) => {
    const next = normalizeQuery(q);
    setQueryState(next);
    meetingsHandlerRef.current?.(next);
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      registerMeetingsSearch,
      applyMeetingsSearch,
    }),
    [query, setQuery, registerMeetingsSearch, applyMeetingsSearch]
  );

  return (
    <WorkspaceSearchContext.Provider value={value}>
      {children}
    </WorkspaceSearchContext.Provider>
  );
}

export function useWorkspaceSearch() {
  const ctx = useContext(WorkspaceSearchContext);
  if (!ctx) {
    throw new Error("useWorkspaceSearch must be used within WorkspaceSearchProvider");
  }
  return ctx;
}
