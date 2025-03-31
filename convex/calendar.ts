import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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
    
    try {
      const events = await ctx.db
        .query("calendarEvents")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();
      
      return events;
    } catch (error) {
      // Handle case where index is still backfilling
      console.error("Calendar query error:", error);
      
      // If the index is backfilling or not found, return an empty array
      if (error instanceof Error && 
          (error.message.includes("backfilling") || 
           error.message.includes("not found"))) {
        return [];
      }
      
      // For other errors, rethrow
      throw new ConvexError("Failed to fetch calendar events: " + error);
    }
  },
}); 