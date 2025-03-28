import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export function useDocumentId() {
  const [currentDocId, setCurrentDocId] = useState<Id<"pages"> | null>(null);
  const router = useRouter();

  const createDocument = useCallback(async (id: Id<"pages">) => {
    setCurrentDocId(id);
    router.push(`/workspace/${id}`);
  }, [router]);

  const openDocument = useCallback((id: Id<"pages">) => {
    setCurrentDocId(id);
    router.push(`/workspace/${id}`);
  }, [router]);

  return {
    currentDocId,
    createDocument,
    openDocument,
  };
} 