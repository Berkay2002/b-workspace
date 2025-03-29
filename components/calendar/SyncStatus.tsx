"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export function SyncStatus() {
  const calendars = useQuery(api.calendar.queries.getCalendars, { userId: "skip" });

  const lastSynced = calendars?.[0]?.lastSynced
    ? new Date(calendars[0].lastSynced)
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Calendar Sync</h3>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {calendars?.map((calendar: Doc<"calendars">) => (
            <div key={calendar._id} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: calendar.color || "hsl(var(--primary))" }}
              />
              <span className="text-sm">{calendar.name}</span>
              {lastSynced ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          ))}
          {(!calendars || calendars.length === 0) && (
            <p className="text-sm text-muted-foreground">No calendars synced</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 