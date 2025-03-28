import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const templates = [
  {
    id: "1",
    title: "Weekly Planner",
    author: "B-Workspace",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Project Dashboard",
    author: "B-Workspace",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "Meeting Notes",
    author: "B-Workspace",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "Content Calendar",
    author: "B-Workspace",
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "5",
    title: "Habit Tracker",
    author: "B-Workspace",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60",
  },
];

export function FeaturedTemplates() {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Templates</h2>
        <Link href="/marketplace">
          <Button variant="link" className="gap-1 px-0">
            Browse all templates
          </Button>
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="flex-shrink-0 overflow-hidden hover:shadow-md"
          >
            <div className="relative h-32 w-64">
              <Image
                src={template.image}
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{template.title}</h3>
              <p className="text-xs text-muted-foreground">by {template.author}</p>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 