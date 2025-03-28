import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";

interface RecentPage {
  id: string;
  title: string;
  lastEdited: string;
  icon?: React.ReactNode;
}

const mockPages: RecentPage[] = [
  {
    id: "1",
    title: "Project Overview",
    lastEdited: "2 hours ago",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Meeting Notes",
    lastEdited: "5 hours ago",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Task List",
    lastEdited: "1 day ago",
    icon: <FileText className="h-4 w-4" />,
  },
];

export function RecentPagesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockPages.map((page) => (
        <Link key={page.id} href={`/workspace/${page.id}`}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {page.icon}
                {page.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {page.lastEdited}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 