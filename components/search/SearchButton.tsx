"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  onOpen: () => void;
}

export function SearchButton({ onOpen }: SearchButtonProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 px-2"
      onClick={onOpen}
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
} 