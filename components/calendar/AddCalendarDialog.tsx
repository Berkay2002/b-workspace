"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCalendarActions } from "@/lib/utils/parseIcal";
import { toast } from "sonner";

interface AddCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PREDEFINED_COLORS = [
  "#885E46", // Brown
  "#4A90E2", // Blue
  "#50E3C2", // Teal
  "#F5A623", // Orange
  "#9013FE", // Purple
  "#7ED321", // Green
  "#D0021B", // Red
  "#F8E71C", // Yellow
];

export function AddCalendarDialog({ open, onOpenChange }: AddCalendarDialogProps) {
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarUrl, setNewCalendarUrl] = useState("");
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const { addCalendar, syncCalendar } = useCalendarActions();

  const handleAddCalendar = async () => {
    if (!newCalendarName || !newCalendarUrl) return;

    try {
      const calendarId = await addCalendar({
        name: newCalendarName,
        icalUrl: newCalendarUrl,
        color: selectedColor,
      });
      
      // Sync events after adding the calendar
      await syncCalendar({ calendarId });
      
      setNewCalendarName("");
      setNewCalendarUrl("");
      setSelectedColor(PREDEFINED_COLORS[0]);
      onOpenChange(false);
      toast.success("Calendar added", {
        description: "Your calendar has been added and events have been synced.",
      });
    } catch (error) {
      console.error("Failed to add calendar:", error);
      toast.error("Error", {
        description: "Failed to add calendar. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Calendar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Calendar Name</Label>
            <Input
              id="name"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              placeholder="e.g., Work Calendar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">iCal URL</Label>
            <Input
              id="url"
              value={newCalendarUrl}
              onChange={(e) => setNewCalendarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Calendar Color</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleAddCalendar} className="w-full">
            Add Calendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 