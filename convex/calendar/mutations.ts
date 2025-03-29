import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const addCalendar = mutation({
  args: {
    name: v.string(),
    icalUrl: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const calendarId = await ctx.db.insert("calendars", {
      name: args.name,
      icalUrl: args.icalUrl,
      userId: args.userId,
      lastSynced: Date.now(),
      color: args.color,
    });

    return calendarId;
  },
});

export const addEvents = mutation({
  args: {
    calendarId: v.id("calendars"),
    events: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.number(),
        location: v.optional(v.string()),
        url: v.optional(v.string()),
        userId: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const eventIds = await Promise.all(
      args.events.map((event) =>
        ctx.db.insert("events", {
          ...event,
          calendarId: args.calendarId,
        })
      )
    );

    return eventIds;
  },
});

export const syncEvents = mutation({
  args: {
    calendarId: v.id("calendars"),
    events: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.number(),
        location: v.optional(v.string()),
        url: v.optional(v.string()),
        userId: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Delete old events
    await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("calendarId"), args.calendarId))
      .collect()
      .then((events) =>
        Promise.all(events.map((event) => ctx.db.delete(event._id)))
      );

    // Add new events
    const eventIds = await Promise.all(
      args.events.map((event) =>
        ctx.db.insert("events", {
          ...event,
          calendarId: args.calendarId,
        })
      )
    );

    // Update last synced time
    await ctx.db.patch(args.calendarId, {
      lastSynced: Date.now(),
    });

    return eventIds;
  },
}); 