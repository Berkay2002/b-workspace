export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <div className="h-4 w-4 animate-pulse rounded-full bg-primary" />
      </div>
      <div className="flex space-x-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
} 