import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

type PageVisit = Doc<"pageVisits">;
type Page = Doc<"pages">;

export const recordVisit = mutation({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const visitedAt = Date.now();

    // Record the visit
    await ctx.db.insert("pageVisits", {
      pageId: args.pageId,
      userId,
      visitedAt,
    });

    // Clean up old visits (keep only last 50 visits per user)
    const visits = await ctx.db
      .query("pageVisits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (visits.length > 50) {
      const oldVisits = visits.slice(50);
      await Promise.all(
        oldVisits.map((visit: PageVisit) => ctx.db.delete(visit._id))
      );
    }
  },
});

export const getRecentVisits = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const limit = args.limit ?? 6;

    // Get recent visits with page details
    const visits = await ctx.db
      .query("pageVisits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Get page details for each visit
    const pages = await Promise.all(
      visits.map(async (visit: PageVisit) => {
        const page = await ctx.db.get(visit.pageId);
        if (!page) return null;
        return {
          ...page,
          visitedAt: visit.visitedAt,
        };
      })
    );

    return pages.filter((page): page is Page & { visitedAt: number } => page !== null);
  },
}); 