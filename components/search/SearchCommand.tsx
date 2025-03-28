"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, FileText } from "lucide-react";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  type: "action" | "recent" | "template";
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  // Mock data - replace with real data from your backend
  const actions = [
    {
      id: "1",
      title: "Ask AI",
      description: "",
      icon: <Sparkles className="h-4 w-4" />,
      action: () => router.push("/ai"),
      type: "action" as const,
    },
  ];

  const pages = [
    {
      id: "2",
      title: "Student Planner",
      description: "Workspace",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/workspace/student-planner"),
      type: "recent" as const,
    },
    {
      id: "3",
      title: "Getting Started",
      description: "Workspace",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/workspace/getting-started"),
      type: "recent" as const,
    },
    {
      id: "4",
      title: "Class Notes",
      description: "Workspace",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/workspace/class-notes"),
      type: "recent" as const,
    },
    {
      id: "5",
      title: "Course Schedule",
      description: "Workspace",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/workspace/course-schedule"),
      type: "recent" as const,
    },
  ];

  const allResults: SearchResult[] = [...actions, ...pages];

  const filteredResults = allResults.filter((result) => {
    if (!query) return true;
    const searchStr = `${result.title} ${result.description || ""}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <CommandInput 
              placeholder="Search or ask a question..." 
              value={query}
              onValueChange={setQuery}
              className="flex h-14 w-full rounded-none border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <ScrollArea className="h-[400px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              
              <CommandGroup heading="Actions">
                {filteredResults
                  .filter((result) => result.type === "action")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={result.action}
                      className="flex items-center gap-2 px-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {result.icon}
                      </div>
                      <div>
                        <p>{result.title}</p>
                        {result.description && (
                          <p className="text-sm text-muted-foreground">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Workspace">
                {filteredResults
                  .filter((result) => result.type === "recent")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={result.action}
                      className="flex items-center gap-2 px-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                        {result.icon}
                      </div>
                      <div>
                        <p>{result.title}</p>
                        {result.description && (
                          <p className="text-sm text-muted-foreground">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
} 