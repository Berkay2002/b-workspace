import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar, FileText, ListTodo, Sparkles } from "lucide-react";

interface Prompt {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const prompts: Prompt[] = [
  {
    icon: <Calendar className="h-4 w-4" />,
    label: "Weekly Plan",
    prompt: "Create a weekly plan for my project",
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: "Summarize",
    prompt: "Summarize this document",
  },
  {
    icon: <ListTodo className="h-4 w-4" />,
    label: "Task List",
    prompt: "Create a task list for my goals",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    label: "Brainstorm",
    prompt: "Help me brainstorm ideas for my project",
  },
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-4">
        {prompts.map((prompt) => (
          <Button
            key={prompt.label}
            variant="outline"
            size="sm"
            onClick={() => onSelect(prompt.prompt)}
            className="flex items-center space-x-2"
          >
            {prompt.icon}
            <span>{prompt.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
} 