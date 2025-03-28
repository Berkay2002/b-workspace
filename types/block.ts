// types/block.ts
export type BlockType = 
  | "heading"
  | "paragraph"
  | "checklist"
  | "table"
  | "gallery"
  | "nested-page";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export const getForPage = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blocks")
      .filter((q) => q.eq(q.field("pageId"), args.pageId))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    pageId: v.id("pages"),
    type: v.string(),
    content: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blocks", args);
  },
});
