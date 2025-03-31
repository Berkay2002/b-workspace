import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export interface Page {
  _id: Id<"pages">;
  _creationTime: number;
  title: string;
  content: string;
  description?: string;
  coverImage?: string;
  icon?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export function usePages(userId?: string) {
  // Fetch pages from Convex with optional userId parameter
  const pages = useQuery(
    api.pages.list, 
    userId !== undefined ? { userId } : {}
  ) as Page[] | undefined;
  
  return {
    pages: pages || []
  };
} 