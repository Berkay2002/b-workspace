import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Security() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Security Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account security
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label>Active Sessions</Label>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Device</p>
                  <p className="text-sm text-muted-foreground">
                    Windows • Chrome • Last active 2 minutes ago
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Sign out
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Login History</Label>
            <Button variant="outline" className="w-full justify-start">
              View login history
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Connected Devices</Label>
            <Button variant="outline" className="w-full justify-start">
              Manage devices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 