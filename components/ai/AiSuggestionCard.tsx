"use client";

interface AiSuggestionCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
}

export function AiSuggestionCard({
  title,
  description,
  icon,
  onClick,
}: AiSuggestionCardProps) {
  return (
    <button
      className="flex flex-shrink-0 flex-col justify-between w-full h-[120px] rounded-md border bg-background p-3 text-left text-foreground transition-colors hover:bg-muted"
      onClick={onClick}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-3 text-lg">{icon}</div>
    </button>
  );
}
