import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

interface CalendarEvent {
  calendarId: Id<"calendars">;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  url?: string;
  lastSynced: number;
}

export const addCalendar = mutation({
  args: {
    name: v.string(),
    icalUrl: v.string(),
    userId: v.string(),
    lastSynced: v.number(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendars", {
      name: args.name,
      icalUrl: args.icalUrl,
      userId: args.userId,
      lastSynced: args.lastSynced,
      color: args.color,
    });
  },
});

export const addEvents = mutation({
  args: {
    events: v.array(
      v.object({
        calendarId: v.id("calendars"),
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.number(),
        location: v.optional(v.string()),
        url: v.optional(v.string()),
        lastSynced: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.events.map((event: CalendarEvent) => ctx.db.insert("events", event))
    );
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

export const syncEvents = mutation({
  args: {
    calendarId: v.id("calendars"),
    events: v.array(
      v.object({
        calendarId: v.id("calendars"),
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.number(),
        location: v.optional(v.string()),
        url: v.optional(v.string()),
        lastSynced: v.number(),
      })
    ),
    lastSynced: v.number(),
  },
  handler: async (ctx, args) => {
    // Delete old events
    const oldEvents = await ctx.db
      .query("events")
      .withIndex("by_calendar", (q) => q.eq("calendarId", args.calendarId))
      .collect();

    await Promise.all(
      oldEvents.map((event) => ctx.db.delete(event._id))
    );

    // Store new events
    await Promise.all(
      args.events.map((event: CalendarEvent) => ctx.db.insert("events", event))
    );

    // Update last synced time
    await ctx.db.patch(args.calendarId, {
      lastSynced: args.lastSynced,
    });
  },
}); 