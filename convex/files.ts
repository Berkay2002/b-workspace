import { v } from "convex/values";
import { mutation } from "./_generated/server";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const generateUploadUrl = mutation({
  args: {
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(args.contentType)) {
      throw new Error(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`
      );
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get URL for uploaded file");
    }

    // Now we can use coverImage directly as it's in the schema
    await ctx.db.patch(args.pageId, {
      coverImage: url,
      updatedAt: Date.now(),
    });

    return url;
  },
}); 