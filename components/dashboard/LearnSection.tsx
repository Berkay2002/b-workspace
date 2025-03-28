import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Book } from "lucide-react";
import Image from "next/image";

const learningResources = [
  {
    id: "1",
    title: "Getting Started with B-Workspace",
    subtitle: "3m read",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Advanced Workspace Tips & Tricks",
    subtitle: "5m read",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "Mastering AI Features",
    subtitle: "7m read",
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "Collaborative Working Guide",
    subtitle: "4m read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
  },
];

export function LearnSection() {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Learn B-Workspace</h2>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {learningResources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-md">
            <div className="relative h-32">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{resource.title}</h3>
            </CardContent>
            <CardFooter className="border-t px-4 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Book className="h-3 w-3" />
                <span>{resource.subtitle}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 