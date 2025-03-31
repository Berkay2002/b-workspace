import { cn } from "@/lib/utils";
import { Bot, User, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: string;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && !isSystem && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Bot className="h-4 w-4" />
        </div>
      )}
      {isSystem && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Terminal className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : isSystem 
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-muted-foreground"
        )}
      >
        <div
          className={cn(
            "prose prose-sm dark:prose-invert",
            isUser ? "prose-invert" : ""
          )}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {timestamp && (
          <span className="text-xs opacity-70">{timestamp}</span>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
} 