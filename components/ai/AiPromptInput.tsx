"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Database, Paperclip, AtSign } from "lucide-react";

interface AiPromptInputProps {
  onSubmit?: (prompt: string) => void;
}

export function AiPromptInput({ onSubmit }: AiPromptInputProps) {
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSubmit?.(prompt);
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-xl border border-muted bg-background shadow-sm">
        <Textarea
          placeholder="Ask AI anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none border-0 bg-transparent px-4 pt-4 focus-visible:ring-0 "
        />
        <div className="flex items-center justify-between border-t px-4 py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <button type="button" className="text-sm flex items-center gap-1">
              <Database className="w-4 h-4" /> All sources
            </button>
            <Paperclip className="w-4 h-4" />
            <AtSign className="w-4 h-4" />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="text-muted-foreground disabled:opacity-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6667 1.33333L7.33333 8.66666M14.6667 1.33333L10 14.6667L7.33333 8.66666M14.6667 1.33333L1.33333 6L7.33333 8.66666"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
