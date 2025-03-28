import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  pages: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(), // From Clerk
    icon: v.optional(v.string()),
    isFavorite: v.boolean(),
    content: v.optional(v.string()),
  }),
  pageVisits: defineTable({
    pageId: v.id("pages"),
    userId: v.string(), // From Clerk
    visitedAt: v.number(),
  }).index("by_user", ["userId"]),
  calendars: defineTable({
    name: v.string(),
    icalUrl: v.string(),
    userId: v.string(),
    lastSynced: v.number(),
    color: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  events: defineTable({
    calendarId: v.id("calendars"),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    url: v.optional(v.string()),
    lastSynced: v.number(),
  }).index("by_calendar", ["calendarId"]),
  blocks: defineTable({
    pageId: v.id("pages"),
    type: v.string(), // heading, paragraph, checklist, table, gallery, image, bullet-list
    content: v.string(),
    order: v.number(),
    // For extensibility
    metadata: v.optional(v.object({
      checked: v.optional(v.boolean()),
      level: v.optional(v.number()),
      alignment: v.optional(v.string()),
    })),
  }),
});
