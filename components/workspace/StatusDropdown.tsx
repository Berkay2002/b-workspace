import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = [
  { value: "not-started", label: "Not Started", dot: "bg-gray-400", text: "text-gray-700" },
  { value: "in-progress", label: "In Progress", dot: "bg-blue-500", text: "text-blue-700" },
  { value: "done", label: "Done", dot: "bg-green-500", text: "text-green-700" },
];

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const current = statuses.find((s) => s.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-fit border-none bg-transparent px-0 text-sm font-medium text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", current?.dot)} />
          <SelectValue placeholder="Status" />
        </div>
      </SelectTrigger>
      <SelectContent side="bottom" align="start">
        {statuses.map((s) => (
          <SelectItem
            key={s.value}
            value={s.value}
            className="cursor-pointer px-2 py-1.5 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
              <span className={cn("text-sm", s.text)}>{s.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
