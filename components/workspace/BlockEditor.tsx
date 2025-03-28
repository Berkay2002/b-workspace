"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  onAddBlock: (type: "paragraph") => void;
}

export function BlockEditor({ onAddBlock }: BlockEditorProps) {
  return (
    <div className="group relative my-2 flex items-center">
      <button
        onClick={() => onAddBlock("paragraph")}
        className={cn(
          "invisible group-hover:visible flex items-center text-muted-foreground hover:text-foreground"
        )}
        title="Add block"
      >
        <Plus className="h-4 w-4" />
      </button>
      <span className="ml-2 text-sm text-muted-foreground group-hover:visible invisible">
        Type &apos;/&apos; for commands
      </span>
    </div>
  );
}
