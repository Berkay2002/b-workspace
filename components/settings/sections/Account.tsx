import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function Account() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || "");

  const handleSave = async () => {
    try {
      await user?.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              <Button onClick={handleSave}>Save</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setName(user?.fullName || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-md border p-2">
              <span>{user?.fullName || "Not set"}</span>
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center justify-between rounded-md border p-2">
            <span>{user?.primaryEmailAddress?.emailAddress}</span>
            <Button variant="ghost" disabled>
              Change
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="flex items-center justify-between rounded-md border p-2">
            <span>••••••••</span>
            <Button variant="ghost">Change password</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 