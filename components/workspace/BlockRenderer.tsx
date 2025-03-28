"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block } from "@/types/block";

interface BlockRendererProps {
  blocks: Block[];
  onUpdateBlock?: (blockId: string, content: string) => void;
}

export function BlockRenderer({ blocks, onUpdateBlock }: BlockRendererProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        const isHovered = hoveredBlockId === block.id;

        return (
          <div
            key={block.id}
            className="group relative pl-6"
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
          >
            {/* Hover controls: + and drag */}
            <div
              className={cn(
                "absolute -left-6 top-1 hidden gap-1 text-muted-foreground group-hover:flex",
                isHovered && "flex"
              )}
            >
              <button
                type="button"
                className="hover:text-foreground"
                aria-label="Add block"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="cursor-grab select-none pl-1">⋮⋮</div>
            </div>

            {/* Block content renderer */}
            {block.type === "heading" && (
              <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateBlock?.(block.id, e.currentTarget.innerText)
                }
                className="relative text-xl font-semibold outline-none min-h-[28px]"
                data-placeholder="Heading"
              >
                {block.content}
              </h2>
            )}

            {block.type === "paragraph" && (
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateBlock?.(block.id, e.currentTarget.innerText)
                }
                className="relative text-base leading-7 outline-none min-h-[24px]"
                data-placeholder="Type '/' for commands"
              >
                {block.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
