"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { useConvex } from "@/lib/hooks/use-convex";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { EditableTitle } from "@/components/workspace/EditableTitle";

interface PageHeaderProps {
  pageId: Id<"pages">;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCoverImage?: string;
}

export function PageHeader({
  pageId,
  defaultTitle = "Untitled",
  defaultDescription = "Add a description...",
  defaultCoverImage = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&h=400&auto=format&fit=crop",
}: PageHeaderProps) {
  const [coverImage, setCoverImage] = useState<string | undefined>(defaultCoverImage);
  const { updatePage, generateUploadUrl, saveStorageId } = useConvex();
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = async (title: string, description?: string) => {
    if (!pageId) return;
    setIsLoading(true);
    try {
      await updatePage({
        id: pageId,
        title,
        description,
      });
    } catch (error) {
      console.error("Failed to update title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pageId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const uploadUrl = await generateUploadUrl({ contentType: file.type });

      // Step 2: POST the file to the URL
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Step 3: Save the storage ID and update the page
      const imageUrl = await saveStorageId({ storageId, pageId });
      setCoverImage(imageUrl);
    } catch (error) {
      console.error("Failed to update cover:", error);
      alert(error instanceof Error ? error.message : "Failed to update cover");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!pageId) return;
    setIsLoading(true);
    try {
      await updatePage({
        id: pageId,
        coverImage: undefined,
      });
      setCoverImage(undefined);
    } catch (error) {
      console.error("Failed to remove cover:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cover Image Area */}
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg border border-muted bg-muted/30">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt="Cover"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-muted/80 hover:bg-muted"
                onClick={() => document.getElementById("cover-upload")?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-muted/80 hover:bg-muted"
                onClick={handleRemoveCover}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Button
              variant="ghost"
              onClick={() => document.getElementById("cover-upload")?.click()}
              className="text-muted-foreground gap-2 hover:bg-muted/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Add cover
                </>
              )}
            </Button>
          </div>
        )}
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      {/* Title + Description */}
      <div className="px-4">
        <EditableTitle
          title={defaultTitle}
          description={defaultDescription}
          onChange={handleTitleChange}
        />
      </div>
    </div>
  );
}
