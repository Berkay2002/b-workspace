"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useConvex } from "@/lib/hooks/use-convex";
import { useDocumentId } from "@/lib/hooks/use-document-id";
import { InboxPanel } from "@/components/inbox/InboxPanel";
import { useInbox } from "@/hooks/use-inbox";
import { Doc } from "@/convex/_generated/dataModel";
import { useSearch } from "@/components/search/SearchProvider";
import { useEffect, useState } from "react";

import {
  Search,
  Sparkles,
  Home,
  Inbox,
  FileText,
  Settings,
  LayoutTemplate,
  Trash,
  Users,
  Plus,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onClickItem?: () => void; // Callback for mobile to close sidebar when an item is clicked
}

export function Sidebar({ className, onClickItem }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { listPages, createPage } = useConvex();
  const { createDocument } = useDocumentId();
  const { toggle: toggleInbox } = useInbox();
  const { setOpen: setSearchOpen } = useSearch();
  const [isMac, setIsMac] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const pages = listPages ?? [];

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username ?? "My Workspace";

  const handleCreatePage = async () => {
    if (!user?.id) return;
    try {
      const pageId = await createPage({ title: "Untitled", userId: user.id });
      if (pageId) createDocument(pageId);
      if (onClickItem) onClickItem();
    } catch (err) {
      console.error("Failed to create page:", err);
    }
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
    if (onClickItem) onClickItem();
  };

  const handleInboxClick = () => {
    toggleInbox();
    if (onClickItem) onClickItem();
  };

  return (
    <>
      <aside
        className={cn(
          "inset-y-0 left-0 z-20 flex flex-col gap-y-4 bg-card text-foreground px-2 py-3",
          "border-r border-border",
          "w-56",
          isMobile ? "" : "fixed",
          className
        )}
      >
        <div className="flex items-center gap-x-2 px-2">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium truncate text-foreground">
            {fullName}
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
              {!isMobile && (
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>K
                </kbd>
              )}
            </button>
            <SidebarLink 
              href="/ai" 
              icon={Sparkles} 
              label="Workspace AI" 
              pathname={pathname} 
              onClick={onClickItem}
            />
            <SidebarLink 
              href="/" 
              icon={Home} 
              label="Home" 
              pathname={pathname} 
              onClick={onClickItem}
            />
            <SidebarLink 
              href="/calendar" 
              icon={Calendar} 
              label="Calendar" 
              pathname={pathname} 
              onClick={onClickItem}
            />
            <button
              onClick={handleInboxClick}
              className="flex items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Inbox className="h-4 w-4" />
              Inbox
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">Private</p>
              <button
                onClick={handleCreatePage}
                className="text-muted-foreground hover:text-foreground"
                title="Add a page"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-y-1">
              {pages.map((page: Doc<"pages">) => (
                <SidebarLink
                  key={page._id}
                  href={`/workspace/${page._id}`}
                  icon={FileText}
                  label={page.title}
                  pathname={pathname}
                  onClick={onClickItem}
                />
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-y-1">
              <SidebarLink 
                href="/settings" 
                icon={Settings} 
                label="Settings" 
                pathname={pathname} 
                onClick={onClickItem}
              />
              <SidebarLink 
                href="/marketplace" 
                icon={LayoutTemplate} 
                label="Templates" 
                pathname={pathname} 
                onClick={onClickItem}
              />
              <SidebarLink 
                href="/trash" 
                icon={Trash} 
                label="Trash" 
                pathname={pathname} 
                onClick={onClickItem}
              />
            </div>
          </div>

          <div className="mt-auto">
            <button className="flex w-full items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <Users className="h-4 w-4" />
              Invite members
            </button>
          </div>
        </nav>
      </aside>

      <InboxPanel />
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  pathname,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
