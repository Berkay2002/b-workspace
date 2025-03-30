import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  url?: string;
  userId: string;
}

export function useCalendarActions() {
  const { user } = useUser();
  const addCalendar = useAction(api.calendar.actions.addCalendar);
  const syncCalendarEvents = useAction(api.calendar.actions.syncCalendarEvents);

  const wrappedAddCalendar = async (args: { name: string; icalUrl: string; color?: string }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return addCalendar({ ...args, userId: user.id });
  };

  const wrappedSyncCalendar = async (args: { calendarId: Id<"calendars"> }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return syncCalendarEvents(args);
  };

  return {
    addCalendar: wrappedAddCalendar,
    syncCalendar: wrappedSyncCalendar,
  };
} 