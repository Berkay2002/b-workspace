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
  const syncCalendar = useAction(api.calendar.actions.syncCalendar);
  const parseIcalUrl = useAction(api.calendar.actions.parseIcalUrl);
  const parseIcalFile = useAction(api.calendar.actions.parseIcalFile);

  const wrappedAddCalendar = async (args: { name: string; icalUrl: string; color?: string }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return addCalendar({ ...args, userId: user.id });
  };

  const wrappedSyncCalendar = async (args: { calendarId: Id<"calendars">; icalUrl: string }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return syncCalendar({ ...args, userId: user.id });
  };

  const wrappedParseIcalUrl = async (args: { url: string }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return parseIcalUrl({ ...args, userId: user.id });
  };

  const wrappedParseIcalFile = async (args: { file: string }) => {
    if (!user?.id) throw new Error("Not authenticated");
    return parseIcalFile({ ...args, userId: user.id });
  };

  return {
    addCalendar: wrappedAddCalendar,
    syncCalendar: wrappedSyncCalendar,
    parseIcalUrl: wrappedParseIcalUrl,
    parseIcalFile: wrappedParseIcalFile,
  };
} 