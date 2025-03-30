import { v } from "convex/values";
import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export interface EventWithCalendar extends Doc<"events"> {
  calendarName: string;
  calendarColor?: string;
}

export const getCalendars = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calendars")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const getEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(args.limit || 100);
  },
});

export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<EventWithCalendar[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter(q => q.gte(q.field("startTime"), now))
      .order("asc")
      .take(args.limit ?? 5);

    // Fetch calendar info for each event
    const eventsWithCalendar = await Promise.all(
      events.map(async (event): Promise<EventWithCalendar> => {
        let calendarName = "Unknown Calendar";
        let calendarColor: string | undefined = undefined;

        if (event.calendarId) {
          const calendar = await ctx.db.get(event.calendarId);
          if (calendar) {
            calendarName = calendar.name;
            calendarColor = calendar.color;
          }
        }

        return {
          ...event,
          calendarName,
          calendarColor,
        };
      })
    );

    return eventsWithCalendar;
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

export const getEvent = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== identity.subject) {
      return null;
    }

    return event;
  },
});

export const getEventsForDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args): Promise<EventWithCalendar[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter(q => 
        q.and(
          q.gte(q.field("startTime"), args.startDate),
          q.lte(q.field("startTime"), args.endDate)
        )
      )
      .order("asc")
      .collect();

    // Fetch calendar info for each event
    const eventsWithCalendar = await Promise.all(
      events.map(async (event): Promise<EventWithCalendar> => {
        let calendarName = "Unknown Calendar";
        let calendarColor: string | undefined = undefined;

        if (event.calendarId) {
          const calendar = await ctx.db.get(event.calendarId);
          if (calendar) {
            calendarName = calendar.name;
            calendarColor = calendar.color;
          }
        }

        return {
          ...event,
          calendarName,
          calendarColor,
        };
      })
    );

    return eventsWithCalendar;
  },
}); 