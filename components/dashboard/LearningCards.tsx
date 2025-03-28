import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Layout, Sparkles } from "lucide-react";

interface LearningCard {
  title: string;
  description: string;
  readTime: string;
  icon: React.ReactNode;
}

const learningCards: LearningCard[] = [
  {
    title: "Getting started with tasks",
    description: "Learn how to create and manage tasks effectively",
    readTime: "5 min read",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Styling your workspace",
    description: "Customize your workspace with themes and layouts",
    readTime: "3 min read",
    icon: <Layout className="h-5 w-5" />,
  },
  {
    title: "Using AI effectively",
    description: "Maximize productivity with AI-powered features",
    readTime: "4 min read",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export function LearningCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {learningCards.map((card) => (
        <Card key={card.title} className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.icon}
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{card.description}</p>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {card.readTime}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 