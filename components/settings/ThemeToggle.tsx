"use client";

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">Dark mode</Label>
        <div className="text-[0.8rem] text-muted-foreground">
          Switch between light and dark themes
        </div>
      </div>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
} 