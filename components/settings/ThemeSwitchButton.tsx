"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeSwitchButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative flex items-center">
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="peer data-[state=checked]:bg-black/80 data-[state=unchecked]:bg-white border border-border transition-colors duration-300"
      />
      {/* Sun Icon */}
      <span
        className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-yellow-500 peer-data-[state=checked]:hidden"
        style={{
          filter: "drop-shadow(0 0 4px rgba(0,0,0,0.75))", // adds contrast
        }}
      >
        <Sun className="h-4 w-4" />
      </span>

      {/* Moon Icon */}
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-white peer-data-[state=unchecked]:hidden">
        <Moon className="h-4 w-4" />
      </span>
    </div>
  );
}
