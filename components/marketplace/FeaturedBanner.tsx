import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function FeaturedBanner() {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Badge variant="secondary">Featured Template</Badge>
            <h2 className="text-2xl font-bold">Weekly Planner</h2>
            <p className="text-muted-foreground">
              A comprehensive weekly planner template to organize your tasks, meetings, and goals.
            </p>
          </div>
          <Button>Use Template</Button>
        </div>
        <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
          <Image
            src="/templates/weekly-planner.png"
            alt="Weekly Planner Template"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Card>
  );
} 