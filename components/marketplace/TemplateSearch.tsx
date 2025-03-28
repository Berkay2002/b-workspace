import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface TemplateSearchProps {
  onSearch: (query: string) => void;
}

export function TemplateSearch({ onSearch }: TemplateSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Try 'weekly planner'"
        value={query}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  );
} 