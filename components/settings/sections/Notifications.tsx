import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Notifications() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mention Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone mentions you
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Page Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about page changes
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comments</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new comments
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
} 