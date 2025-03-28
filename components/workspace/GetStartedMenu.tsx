"use client";

import {
  Database,
  FileText,
  MoreHorizontal,
  Mic,
  LayoutList,
  List,
  CalendarDays,
  GalleryVertical,
  Download,
  Timer,
  LayoutTemplate,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function GetStartedMenu() {
  return (
    <div className="flex w-full flex-col items-center justify-center pt-20">
      <p className="mb-4 text-sm text-muted-foreground">Get started with</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 py-1.5 flex items-center space-x-2"
        >
          <Mic className="h-4 w-4" />
          <span>Ask AI</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 py-1.5 flex items-center space-x-2"
        >
          <Database className="h-4 w-4" />
          <span>Database</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 py-1.5 flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Form</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 py-1.5 flex items-center space-x-2"
        >
          <LayoutTemplate className="h-4 w-4" />
          <span>Templates</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full p-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <LayoutList className="mr-2 h-4 w-4" />
              Board
            </DropdownMenuItem>
            <DropdownMenuItem>
              <List className="mr-2 h-4 w-4" />
              List
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Timer className="mr-2 h-4 w-4" />
              Timeline
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GalleryVertical className="mr-2 h-4 w-4" />
              Gallery
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Import
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
