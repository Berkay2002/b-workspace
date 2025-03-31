import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const pageId = await ctx.db.insert("pages", {
      title: args.title,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: "", // Initialize with empty content
      description: "",
      isFavorite: false,
      icon: "",
    });

    return pageId;
  },
});

export const list = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Use provided userId if available, otherwise use the current user's ID
    const userId = args.userId || identity.subject;
    
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    return pages;
  },
});

export const getById = query({
  args: {
    id: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
