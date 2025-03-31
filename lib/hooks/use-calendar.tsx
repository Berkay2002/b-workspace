import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export interface CalendarEvent {
  _id: Id<"calendarEvents">;
  _creationTime: number;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export function useCalendar(userId?: string) {
  const [calendarEnabled, setCalendarEnabled] = useState<boolean>(
    () => localStorage.getItem("aiCalendarAccess") === "true"
  );
  
  // Fetch events from Convex with optional userId parameter
  const events = useQuery(
    api.calendar.list,
    userId !== undefined ? { userId } : {}
  ) as CalendarEvent[] | undefined;

  // Toggle calendar access for AI
  const toggleCalendarAccess = (enabled: boolean) => {
    setCalendarEnabled(enabled);
    localStorage.setItem("aiCalendarAccess", enabled.toString());
  };

  return {
    events: calendarEnabled ? events || [] : [],
    calendarEnabled,
    toggleCalendarAccess
  };
} 