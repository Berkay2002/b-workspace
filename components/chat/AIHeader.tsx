import { Sparkles } from "lucide-react";

export function AIHeader() {
  return (
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-primary/10 p-2">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-sm text-muted-foreground">
          Ask me anything about writing, planning, or brainstorming
        </p>
      </div>
    </div>
  );
} 