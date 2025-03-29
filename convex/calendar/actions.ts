"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import ical from "node-ical";
import type { VEvent } from "node-ical";

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  url?: string;
  userId: string;
}

export const parseIcalUrl = action({
  args: {
    url: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<CalendarEvent[]> => {
    const events = await ical.async.fromURL(args.url);
    return Object.values(events)
      .filter((event): event is VEvent => event.type === "VEVENT")
      .map((event): CalendarEvent => ({
        title: event.summary,
        description: event.description,
        startTime: event.start.getTime(),
        endTime: event.end.getTime(),
        location: event.location,
        url: event.url,
        userId: args.userId,
      }));
  },
});

export const parseIcalFile = action({
  args: {
    file: v.string(), // Base64 encoded file content
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<CalendarEvent[]> => {
    const buffer = Buffer.from(args.file, 'base64');
    const events = await ical.async.parseICS(buffer.toString());
    return Object.values(events)
      .filter((event): event is VEvent => event.type === "VEVENT")
      .map((event): CalendarEvent => ({
        title: event.summary,
        description: event.description,
        startTime: event.start.getTime(),
        endTime: event.end.getTime(),
        location: event.location,
        url: event.url,
        userId: args.userId,
      }));
  },
});

export const addCalendar = action({
  args: {
    name: v.string(),
    icalUrl: v.string(),
    userId: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"calendars">> => {
    // Create calendar
    const calendarId = await ctx.runMutation(api.calendar.internal.addCalendar, {
      name: args.name,
      icalUrl: args.icalUrl,
      userId: args.userId,
      lastSynced: Date.now(),
      color: args.color,
    });

    // Fetch and add events
    const events = await ctx.runAction(api.calendar.actions.parseIcalUrl, {
      url: args.icalUrl,
      userId: args.userId,
    });

    await ctx.runMutation(api.calendar.internal.addEvents, {
      events: events.map((event: CalendarEvent) => ({
        ...event,
        calendarId,
      })),
    });

    return calendarId;
  },
});

export const syncCalendar = action({
  args: {
    calendarId: v.id("calendars"),
    icalUrl: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"calendars">> => {
    // Fetch new events
    const events = await ctx.runAction(api.calendar.actions.parseIcalUrl, {
      url: args.icalUrl,
      userId: args.userId,
    });
    
    // Sync events
    await ctx.runMutation(api.calendar.internal.syncEvents, {
      calendarId: args.calendarId,
      events: events.map((event: CalendarEvent) => ({
        ...event,
        calendarId: args.calendarId,
      })),
      lastSynced: Date.now(),
    });

    return args.calendarId;
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
        ...args,
        userId: identity.subject,
      }],
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

    const { title, description, location, url, startTime, endTime } = args;
    return await ctx.runMutation(api.calendar.mutations.syncEvents, {
      calendarId: event.calendarId,
      events: [{
        title: title ?? event.title,
        description: description ?? event.description,
        location: location ?? event.location,
        url: url ?? event.url,
        startTime: startTime ?? event.startTime,
        endTime: endTime ?? event.endTime,
        userId: identity.subject,
      }],
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
    });
  },
}); 