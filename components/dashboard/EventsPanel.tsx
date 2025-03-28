import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";

interface Event {
  title: string;
  time: string;
  date: string;
}

const mockEvents: Event[] = [
  {
    title: "Team Standup",
    time: "10:00 AM",
    date: "Today",
  },
  {
    title: "Project Review",
    time: "2:00 PM",
    date: "Tomorrow",
  },
];

export function EventsPanel() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Calendar className="mr-2 h-4 w-4" />
          Upcoming Events
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div key={event.title} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.time} • {event.date}
                </p>
              </div>
            </div>
          ))}
          {mockEvents.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 