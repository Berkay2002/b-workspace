import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Workspace() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Workspace Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your workspace preferences
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Workspace Name</Label>
            <Input defaultValue="My Workspace" />
          </div>
          <div className="space-y-2">
            <Label>Workspace URL</Label>
            <div className="flex gap-2">
              <Input defaultValue="my-workspace" />
              <Button variant="outline">Change</Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Team Collaboration</Label>
              <p className="text-sm text-muted-foreground">
                Allow team members to collaborate
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Page History</Label>
              <p className="text-sm text-muted-foreground">
                Track changes to pages
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Default Page Template</Label>
            <Button variant="outline" className="w-full justify-start">
              Select template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 