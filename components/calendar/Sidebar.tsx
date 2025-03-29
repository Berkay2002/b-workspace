"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format, isToday, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

interface SidebarProps {
  currentDate: Date;
}

export function Sidebar({ currentDate }: SidebarProps) {
  const events = useQuery(api.calendar.queries.getUpcomingEvents, { limit: 100 });
  const calendars = useQuery(api.calendar.queries.getCalendars, { userId: "skip" });

  const todayEvents = events?.filter((event: Doc<"events">) =>
    isSameDay(new Date(event.startTime), new Date())
  );

  const getCalendarColor = (event: Doc<"events">) => {
    const calendar = calendars?.find(cal => cal._id === event.calendarId);
    return calendar?.color || "hsl(var(--primary))";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold">Today&apos;s Events</h3>
          <div className="mt-2 space-y-2">
            {todayEvents?.map((event: Doc<"events">) => (
              <div
                key={event._id}
                className="flex items-start gap-2 rounded-md p-2 hover:bg-muted/50"
              >
                <div
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: getCalendarColor(event) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(event.startTime), "h:mm a")}</span>
                    {event.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!todayEvents || todayEvents.length === 0) && (
              <p className="text-sm text-muted-foreground">No events today</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold">Mini Calendar</h3>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 text-xs",
                  isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)) &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 