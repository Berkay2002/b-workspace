import { v } from "convex/values";
import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

interface EventWithCalendar extends Doc<"events"> {
  calendarName: string;
  calendarColor?: string;
}

export const getCalendars = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    return await ctx.db
      .query("calendars")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const limit = args.limit ?? 5;
    const now = Date.now();

    // Get user's calendars
    const calendars = await ctx.db
      .query("calendars")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get upcoming events from all calendars
    const events = await Promise.all(
      calendars.map(async (calendar) => {
        const calendarEvents = await ctx.db
          .query("events")
          .withIndex("by_calendar", (q) => q.eq("calendarId", calendar._id))
          .filter((q) => q.gte(q.field("startTime"), now))
          .order("asc")
          .take(limit);

        return calendarEvents.map((event): EventWithCalendar => ({
          ...event,
          calendarName: calendar.name,
          calendarColor: calendar.color,
        }));
      })
    );

    // Flatten and sort all events
    const allEvents = events
      .flat()
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, limit);

    return allEvents;
  },
});

export const getCalendar = query({
  args: {
    calendarId: v.id("calendars"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.calendarId);
  },
}); 