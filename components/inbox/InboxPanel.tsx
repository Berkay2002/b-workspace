"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useInbox } from "@/hooks/use-inbox";
import { InboxEmptyState } from "./InboxEmptyState";
import { cn } from "@/lib/utils";

export function InboxPanel() {
  const { isOpen, close } = useInbox();
  const [animateOut, setAnimateOut] = React.useState(false);

  const triggerClose = React.useCallback(() => {
    setAnimateOut(true);
    setTimeout(() => {
      close();
      setAnimateOut(false);
    }, 200); // match animation duration
  }, [close]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [triggerClose]);

  if (!isOpen && !animateOut) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 ml-60 bg-black/20 transition-opacity duration-200",
          animateOut ? "opacity-0" : "opacity-100"
        )}
        onClick={triggerClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed left-60 top-0 z-50 h-full w-[300px] bg-background shadow-lg",
          !isOpen && "transform -translate-x-[300px]",
          "transition-transform duration-200 ease-out",
          animateOut ? "animate-slide-out" : "animate-slide-in"
        )}
        style={{ 
          willChange: "transform",
          transformOrigin: "left"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <button
            onClick={triggerClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto">
          <InboxEmptyState />
        </div>
      </div>
    </>
  );
}
