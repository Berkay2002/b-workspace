"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search } from "lucide-react";
import Image from "next/image";

const templates = [
  {
    id: "1",
    title: "Weekly Planner",
    description: "Organize your week with this comprehensive planner template",
    author: "B-Workspace",
    rating: 4.8,
    isFree: true,
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60",
    tags: ["Productivity", "Planning"],
  },
  {
    id: "2",
    title: "Project Dashboard",
    description: "Track your project progress with this visual dashboard",
    author: "B-Workspace",
    rating: 4.6,
    isFree: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    tags: ["Project Management", "Business"],
  },
  {
    id: "3",
    title: "Meeting Notes",
    description: "Capture and organize your meeting notes efficiently",
    author: "B-Workspace",
    rating: 4.7,
    isFree: true,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    tags: ["Business", "Productivity"],
  },
  {
    id: "4",
    title: "Content Calendar",
    description: "Plan and schedule your content with this calendar template",
    author: "B-Workspace",
    rating: 4.5,
    isFree: true,
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&auto=format&fit=crop&q=60",
    tags: ["Content", "Planning"],
  },
  {
    id: "5",
    title: "Habit Tracker",
    description: "Track your daily habits and build better routines",
    author: "B-Workspace",
    rating: 4.9,
    isFree: true,
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60",
    tags: ["Personal", "Health"],
  },
];

const categories = [
  "All",
  "Productivity",
  "Business",
  "Personal",
  "Education",
  "Health",
];

export default function MarketplacePage() {
  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground">
          Choose from a variety of pre-made templates to get started quickly
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant="outline"
            className="cursor-pointer hover:bg-primary/10"
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-md">
            <div className="relative h-48">
              <Image
                src={template.image}
                alt={template.title}
                fill
                className="object-cover"
              />
              {template.isFree && (
                <Badge
                  variant="secondary"
                  className="absolute right-2 top-2 bg-white/90 text-green-600 hover:bg-white/90"
                >
                  Free
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>by {template.author}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {template.isFree ? "Use Template" : "Get Pro"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 