import { Button } from "@/components/ui/button";

const tags = [
  "Work",
  "Life",
  "School",
  "Travel Planner",
  "Vision Board",
  "Project Management",
  "Personal Notes",
  "Team Wiki",
  "Knowledge Base",
  "Task Tracking",
];

export function TagScroller() {
  return (
    <div className="container py-12">
      <div className="flex overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              className="whitespace-nowrap rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 