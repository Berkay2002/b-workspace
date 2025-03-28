import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export function Preferences() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize how B-Workspace looks on your device
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Show more content in a compact layout
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
} 