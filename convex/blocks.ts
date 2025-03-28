import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all blocks for a specific page, ordered by their sequence
export const getForPage = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("blocks")
      .filter((q) => q.eq(q.field("pageId"), args.pageId))
      .order("asc")
      .collect();
  },
});

// Create a new block in a page
export const create = mutation({
  args: {
    pageId: v.id("pages"),
    type: v.string(),
    content: v.string(),
    order: v.number(),
    metadata: v.optional(
      v.object({
        checked: v.optional(v.boolean()),
        level: v.optional(v.number()),
        alignment: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("blocks", args);
  },
});

// Update an existing block
export const update = mutation({
  args: {
    id: v.id("blocks"),
    content: v.optional(v.string()),
    type: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        checked: v.optional(v.boolean()),
        level: v.optional(v.number()),
        alignment: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a block
export const remove = mutation({
  args: {
    id: v.id("blocks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

// Reorder blocks within a page
export const reorder = mutation({
  args: {
    id: v.id("blocks"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { order: args.order });
    return args.id;
  },
});
  