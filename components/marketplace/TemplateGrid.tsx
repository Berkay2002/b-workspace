import { TemplateCard } from "./TemplateCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

interface Template {
  id: string;
  title: string;
  creator: string;
  rating: number;
  isFree: boolean;
  imageUrl: string;
  tags: string[];
}

interface TemplateGridProps {
  searchQuery: string;
  selectedTags: string[];
}

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Weekly Planner",
    creator: "Notion",
    rating: 4.8,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop",
    tags: ["Productivity", "Planning"],
  },
  {
    id: "2",
    title: "Project Dashboard",
    creator: "Notion",
    rating: 4.6,
    isFree: false,
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
    tags: ["Project Management", "Business"],
  },
  {
    id: "3",
    title: "Meeting Notes",
    creator: "Notion",
    rating: 4.7,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    tags: ["Business", "Productivity"],
  },
  // Add more mock templates as needed
];

export function TemplateGrid({ searchQuery, selectedTags }: TemplateGridProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState(mockTemplates);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesTags =
        selectedTags.includes("All") ||
        selectedTags.every((tag) => template.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [templates, searchQuery, selectedTags]);

  const handleUseTemplate = (id: string) => {
    // Handle template duplication
    console.log("Using template:", id);
  };

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading more templates
    setTimeout(() => {
      setTemplates((prev) => [...prev, ...mockTemplates]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            {...template}
            onUse={handleUseTemplate}
          />
        ))}
      </div>
      {filteredTemplates.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more templates"
            )}
          </Button>
        </div>
      )}
      {filteredTemplates.length === 0 && (
        <div className="text-center text-muted-foreground">
          No templates found matching your criteria.
        </div>
      )}
    </div>
  );
} 