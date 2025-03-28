import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { Preferences } from "./sections/Preferences";
import { Language } from "./sections/Language";
import { Notifications } from "./sections/Notifications";
import { Account } from "./sections/Account";
import { Workspace } from "./sections/Workspace";
import { Security } from "./sections/Security";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsDialog() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] p-0">
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <SheetTitle>Preferences</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="sticky top-0 z-10 w-full justify-start border-b bg-background px-6">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="language">Language & Time</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="preferences">
                <Preferences />
              </TabsContent>
              <TabsContent value="language">
                <Language />
              </TabsContent>
              <TabsContent value="notifications">
                <Notifications />
              </TabsContent>
              <TabsContent value="account">
                <Account />
              </TabsContent>
              <TabsContent value="workspace">
                <Workspace />
              </TabsContent>
              <TabsContent value="security">
                <Security />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
} 