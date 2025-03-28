"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "@/lib/hooks/use-convex";
import { useDocumentId } from "@/lib/hooks/use-document-id";
import { Doc } from "@/convex/_generated/dataModel";

export function PageSidebar() {
  const pathname = usePathname();
  const currentDocId = pathname.split("/").pop();
  const { user } = useUser();
  const { listPages, createPage } = useConvex();
  const { createDocument } = useDocumentId();

  const pages = listPages ?? [];

  const handleNewPage = async () => {
    if (!user) return;
    
    const pageId = await createPage({
      title: "Untitled",
      userId: user.id,
    });
    
    createDocument(pageId);
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleNewPage}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Favorites
              </div>
              {pages
                .filter((page: Doc<"pages">) => page.isFavorite)
                .map((page: Doc<"pages">) => (
                  <Link
                    key={page._id}
                    href={`/workspace/${page._id}`}
                    className={`flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                      currentDocId === page._id
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                All Pages
              </div>
              {pages.map((page: Doc<"pages">) => (
                <Link
                  key={page._id}
                  href={`/workspace/${page._id}`}
                  className={`flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                    currentDocId === page._id
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
      <div className="hidden w-80 border-r lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleNewPage}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Favorites
              </div>
              {pages
                .filter((page: Doc<"pages">) => page.isFavorite)
                .map((page: Doc<"pages">) => (
                  <Link
                    key={page._id}
                    href={`/workspace/${page._id}`}
                    className={`flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                      currentDocId === page._id
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                All Pages
              </div>
              {pages.map((page: Doc<"pages">) => (
                <Link
                  key={page._id}
                  href={`/workspace/${page._id}`}
                  className={`flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                    currentDocId === page._id
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Sheet>
  );
} 