"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import ical, { VEvent } from "node-ical";
import { Id } from "../_generated/dataModel";

interface EventInput {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  url?: string;
}

export const addCalendar = action({
  args: {
    name: v.string(),
    icalUrl: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"calendars">> => {
    // Create calendar
    const calendarId = await ctx.runMutation(api.calendar.mutations.addCalendar, {
      name: args.name,
      icalUrl: args.icalUrl,
      userId: args.userId,
      color: args.color,
    });

    return calendarId;
  },
});

export const syncCalendarEvents = action({
  args: {
    calendarId: v.id("calendars"),
  },
  handler: async (ctx, args): Promise<void> => {
    // Get calendar and verify ownership
    const calendar = await ctx.runQuery(api.calendar.queries.getCalendar, {
      calendarId: args.calendarId,
    });

    if (!calendar) {
      throw new Error("Calendar not found");
    }

    if (!calendar.icalUrl) {
      throw new Error("Calendar has no iCal URL");
    }

    // Fetch and parse events
    const events = await ical.fromURL(calendar.icalUrl);
    const parsedEvents: EventInput[] = Object.values(events)
      .filter((event): event is VEvent => event.type === "VEVENT")
      .map((event) => ({
        title: event.summary || "Untitled Event",
        description: event.description,
        startTime: event.start.getTime(),
        endTime: event.end.getTime(),
        location: event.location,
        url: event.url,
      }));

    // Sync events
    await ctx.runMutation(api.calendar.mutations.syncEvents, {
      calendarId: args.calendarId,
      events: parsedEvents,
      userId: calendar.userId,
    });
  },
});

export const addEvent = action({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    url: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    calendarId: v.optional(v.id("calendars")),
  },
  handler: async (ctx, args): Promise<Id<"events">[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const defaultCalendarId = await ctx.runMutation(api.calendar.mutations.addCalendar, {
      name: "Default Calendar",
      icalUrl: "",
      userId: identity.subject,
    });

    return await ctx.runMutation(api.calendar.mutations.addEvents, {
      calendarId: args.calendarId ?? defaultCalendarId,
      events: [{
        title: args.title,
        description: args.description,
        startTime: args.startTime,
        endTime: args.endTime,
        location: args.location,
        url: args.url,
      }],
      userId: identity.subject,
    });
  },
});

export const updateEvent = action({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    url: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    calendarId: v.optional(v.id("calendars")),
  },
  handler: async (ctx, args): Promise<Id<"events">[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const event = await ctx.runQuery(api.calendar.queries.getEvent, { id: args.id });
    if (!event || event.userId !== identity.subject) {
      throw new Error("Not found");
    }

    if (!event.calendarId) {
      throw new Error("Event has no calendar");
    }

    return await ctx.runMutation(api.calendar.mutations.syncEvents, {
      calendarId: event.calendarId,
      events: [{
        title: args.title ?? event.title,
        description: args.description ?? event.description,
        location: args.location ?? event.location,
        url: args.url ?? event.url,
        startTime: args.startTime ?? event.startTime,
        endTime: args.endTime ?? event.endTime,
      }],
      userId: identity.subject,
    });
  },
});

export const deleteEvent = action({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args): Promise<Id<"events">[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const event = await ctx.runQuery(api.calendar.queries.getEvent, { id: args.id });
    if (!event || event.userId !== identity.subject) {
      throw new Error("Not found");
    }

    if (!event.calendarId) {
      throw new Error("Event has no calendar");
    }

    return await ctx.runMutation(api.calendar.mutations.syncEvents, {
      calendarId: event.calendarId,
      events: [],
      userId: identity.subject,
    });
  },
}); 