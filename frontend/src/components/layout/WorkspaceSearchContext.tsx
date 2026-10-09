"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type WorkspaceSearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  /** Meetings page registers to receive live title search updates */
  registerMeetingsSearch: (handler: ((q: string) => void) | null) => void;
  applyMeetingsSearch: (q: string) => void;
};

const WorkspaceSearchContext = createContext<WorkspaceSearchContextValue | null>(
  null
);

export function WorkspaceSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [meetingsHandler, setMeetingsHandler] = useState<
    ((q: string) => void) | null
  >(null);

  const registerMeetingsSearch = useCallback(
    (handler: ((q: string) => void) | null) => {
      setMeetingsHandler(handler);
    },
    []
  );

  const applyMeetingsSearch = useCallback(
    (q: string) => {
      setQuery(q);
      meetingsHandler?.(q);
    },
    [meetingsHandler]
  );

  const value = useMemo(
    () => ({
      query,
      setQuery,
      registerMeetingsSearch,
      applyMeetingsSearch,
    }),
    [query, registerMeetingsSearch, applyMeetingsSearch]
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
