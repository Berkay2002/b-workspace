"use client";

import * as React from "react";
import { SearchCommand } from "./SearchCommand";

interface SearchContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <SearchCommand open={open} onOpenChange={setOpen} />
    </SearchContext.Provider>
  );
} 