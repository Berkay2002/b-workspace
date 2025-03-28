import { Mail } from "lucide-react";

export function InboxEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-20 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Mail className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-sm font-medium">You&apos;re all caught up</h3>
      <p className="text-sm text-muted-foreground">
        You&apos;ll be notified here for @mentions, page activity, and page invites
      </p>
    </div>
  );
} 