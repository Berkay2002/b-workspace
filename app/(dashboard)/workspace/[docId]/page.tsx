"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import type { Block, BlockType } from "@/types/block";

import { Sidebar } from "@/components/shared/Sidebar";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BlockRenderer } from "@/components/workspace/BlockRenderer";
import { BlockEditor } from "@/components/workspace/BlockEditor";
import { GetStartedMenu } from "@/components/workspace/GetStartedMenu";

export default function WorkspacePage() {
  const { docId } = useParams() as { docId: string };
  const pageId = docId as Id<"pages">;

  const blocks = useQuery(api.blocks.getForPage, { pageId });
  const addBlock = useMutation(api.blocks.create);
  const recordVisit = useMutation(api.pageVisits.recordVisit);

  useEffect(() => {
    if (pageId) {
      recordVisit({ pageId });
    }
  }, [pageId, recordVisit]);

  const handleAddBlock = async (type: "heading" | "paragraph") => {
    if (!pageId) return;

    await addBlock({
      pageId,
      type,
      content: "",
      order: blocks?.length ?? 0,
    });
  };

  if (!blocks) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const mappedBlocks: Block[] = blocks.map(block => ({
    id: block._id,
    type: block.type as BlockType,
    content: block.content
  }));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <PageHeader pageId={pageId} />
          <div className="mt-6 space-y-6">
            <BlockRenderer blocks={mappedBlocks} />
            <BlockEditor onAddBlock={handleAddBlock} />
          </div>
        </div>

        {/* Notion-style bottom center menu */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          <GetStartedMenu />
        </div>
      </main>
    </div>
  );
}
