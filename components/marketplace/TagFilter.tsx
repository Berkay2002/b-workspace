import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagSelect }: TagFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-4">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => onTagSelect(tag)}
            className="rounded-full"
          >
            {tag}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
} 