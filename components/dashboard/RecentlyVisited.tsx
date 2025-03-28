"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

type PageWithVisit = Doc<"pages"> & {
  visitedAt: number;
};

export function RecentlyVisited() {
  const recentPages = useQuery(api.pageVisits.getRecentVisits, { limit: 6 });

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!recentPages) {
    return null;
  }

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-xl font-semibold">Recently Visited</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {recentPages.map((page: PageWithVisit) => (
          <Link 
            key={page._id} 
            href={`/workspace/${page._id}`}
            className="flex-shrink-0"
          >
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardContent className="flex w-48 flex-col space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded bg-primary/10 p-1 text-primary">
                    {page.icon ? (
                      <span className="text-lg">{page.icon}</span>
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium line-clamp-1">{page.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(page.visitedAt)}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 