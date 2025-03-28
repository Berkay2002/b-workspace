import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export function useConvex() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  // Pages
  const createPage = useMutation(api.pages.create);
  const listPages = useQuery(api.pages.list, { userId });
  const updatePage = useMutation(api.pages.update);

  // Files
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);

  return {
    // Pages
    createPage,
    listPages,
    updatePage,
    
    // Files
    generateUploadUrl,
    saveStorageId,
    
    // Blocks
    createBlock: useMutation(api.blocks.create),
    updateBlock: useMutation(api.blocks.update),
    deleteBlock: useMutation(api.blocks.remove),
    reorderBlocks: useMutation(api.blocks.reorder),
  };
}

export function usePage(id: Id<"pages">) {
  return useQuery(api.pages.getById, { id });
}

export function useBlocks(pageId: Id<"pages">) {
  return useQuery(api.blocks.getForPage, { pageId });
} 