"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Doc } from "@/convex/_generated/dataModel";
import { useCalendarActions } from "@/lib/utils/parseIcal";

interface EventWithCalendar extends Doc<"events"> {
  calendarName: string;
  calendarColor?: string;
}

export function UpcomingEvents() {
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarUrl, setNewCalendarUrl] = useState("");

  const events = useQuery(api.calendar.queries.getUpcomingEvents, { 
    limit: 5
  });
  const { addCalendar } = useCalendarActions();

  const handleAddCalendar = async () => {
    if (!newCalendarName || !newCalendarUrl) return;

    try {
      await addCalendar({
        name: newCalendarName,
        icalUrl: newCalendarUrl,
      });
      setNewCalendarName("");
      setNewCalendarUrl("");
      setIsAddingCalendar(false);
    } catch (error) {
      console.error("Failed to add calendar:", error);
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Starting now";
    if (diffInMinutes < 60) return `In ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `In ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `In ${diffInDays}d`;
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!events || events.length === 0) {
    return (
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Dialog open={isAddingCalendar} onOpenChange={setIsAddingCalendar}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Add Calendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Calendar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Calendar Name</Label>
                  <Input
                    id="name"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                    placeholder="e.g., Work Calendar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">iCal URL</Label>
                  <Input
                    id="url"
                    value={newCalendarUrl}
                    onChange={(e) => setNewCalendarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleAddCalendar} className="w-full">
                  Add Calendar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Calendar className="mb-2 h-8 w-8" />
            <p>No upcoming events</p>
            <p className="text-sm">Add a calendar to see your events here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <Dialog open={isAddingCalendar} onOpenChange={setIsAddingCalendar}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Add Calendar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Calendar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Calendar Name</Label>
                <Input
                  id="name"
                  value={newCalendarName}
                  onChange={(e) => setNewCalendarName(e.target.value)}
                  placeholder="e.g., Work Calendar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">iCal URL</Label>
                <Input
                  id="url"
                  value={newCalendarUrl}
                  onChange={(e) => setNewCalendarUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button onClick={handleAddCalendar} className="w-full">
                Add Calendar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {events.map((event: EventWithCalendar) => (
          <Card key={event._id} className="cursor-pointer hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: event.calendarColor || 'hsl(var(--primary))' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{event.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(event.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(event.startTime)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 