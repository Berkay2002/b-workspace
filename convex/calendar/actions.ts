"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { api } from "../_generated/api";
import ical from "node-ical";
import type { VEvent } from "node-ical";

type CalendarId = Id<"calendars">;

export const addCalendar = action({
  args: {
    name: v.string(),
    icalUrl: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CalendarId> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Create calendar
    const calendarId = await ctx.runMutation(api.calendar.mutations.addCalendar, {
      name: args.name,
      icalUrl: args.icalUrl,
      userId,
      lastSynced: now,
      color: args.color,
    });

    // Fetch and store events
    try {
      const events = await ical.async.fromURL(args.icalUrl);
      
      // Convert events to our format
      const calendarEvents = Object.values(events)
        .filter((event): event is VEvent => event.type === "VEVENT")
        .map((event) => ({
          calendarId,
          title: event.summary,
          description: event.description,
          startTime: event.start.getTime(),
          endTime: event.end.getTime(),
          location: event.location,
          url: event.url,
          lastSynced: now,
        }));

      // Store events
      await ctx.runMutation(api.calendar.mutations.addEvents, {
        events: calendarEvents,
      });
    } catch (error) {
      console.error("Failed to sync calendar:", error);
      // Don't throw, just log the error
    }

    return calendarId;
  },
});

export const syncCalendar = action({
  args: {
    calendarId: v.id("calendars"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const calendar = await ctx.runQuery(api.calendar.queries.getCalendar, {
      calendarId: args.calendarId,
    });
    if (!calendar) {
      throw new Error("Calendar not found");
    }

    const now = Date.now();

    try {
      // Fetch new events
      const events = await ical.async.fromURL(calendar.icalUrl);
      
      // Convert events to our format
      const calendarEvents = Object.values(events)
        .filter((event): event is VEvent => event.type === "VEVENT")
        .map((event) => ({
          calendarId: args.calendarId,
          title: event.summary,
          description: event.description,
          startTime: event.start.getTime(),
          endTime: event.end.getTime(),
          location: event.location,
          url: event.url,
          lastSynced: now,
        }));

      // Delete old events and store new ones
      await ctx.runMutation(api.calendar.mutations.syncEvents, {
        calendarId: args.calendarId,
        events: calendarEvents,
        lastSynced: now,
      });
    } catch (error) {
      console.error("Failed to sync calendar:", error);
      throw error;
    }
  },
}); 