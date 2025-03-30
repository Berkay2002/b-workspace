"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  startOfToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
  Calendar,
  Clock2,
  Clock12,
  EyeOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarActions } from "@/lib/utils/parseIcal";

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  use24Hour?: boolean;
  onToggleTimeFormat: () => void;
  showAllHours?: boolean;
  onToggleHourRange: () => void;
  visibleCalendars: Set<Id<"calendars">>;
  onToggleCalendar: (calendarId: Id<"calendars">) => void;
  className?: string;
}

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  use24Hour = false,
  onToggleTimeFormat,
  showAllHours = true,
  onToggleHourRange,
  visibleCalendars,
  onToggleCalendar,
  className,
}: CalendarSidebarProps) {
  const { user } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarUrl, setNewCalendarUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  const calendars = useQuery(api.calendar.queries.getCalendars, {
    userId: user?.id || "",
  });

  const { addCalendar } = useCalendarActions();
  const updateCalendarColor = useMutation(api.calendar.mutations.updateCalendarColor);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handleAddCalendar = async () => {
    if (!newCalendarName || !newCalendarUrl) return;

    try {
      await addCalendar({
        name: newCalendarName,
        icalUrl: newCalendarUrl,
      });
      setNewCalendarName("");
      setNewCalendarUrl("");
      setIsAddingCalendar(false);
    } catch (error) {
      console.error("Failed to add calendar:", error);
    }
  };

  const updateColor = async (calendarId: Id<"calendars">, color: string) => {
    try {
      await updateCalendarColor({ calendarId, color });
    } catch (err) {
      console.error("Failed to update calendar color:", err);
    }
  };

  const toggleCalendarVisibility = (calendarId: Id<"calendars">) => {
    onToggleCalendar(calendarId);
  };

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const today = startOfToday();

  const daysInMonth = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i - currentMonth.getDay() + 1
    );
    return date;
  });

  return (
    <div className={cn(
      "w-64 bg-muted/10 p-4 flex flex-col h-full overflow-auto",
      isMobile ? "pt-12 border-none w-full" : "border-l",
      className
    )}>
      {/* Add Calendar Button */}
      <Dialog open={isAddingCalendar} onOpenChange={setIsAddingCalendar}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            <Calendar className="h-4 w-4" />
            Add calendar
          </Button>
        </DialogTrigger>
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
            <Button onClick={handleAddCalendar} className="w-full">
              Add Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mini Calendar */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <span className={cn("font-medium", isMobile ? "text-sm" : "")}>
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center text-sm">
          {daysInMonth.map((date, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              onClick={() => onDateSelect(date)}
              className={cn(
                "h-7 w-7 p-0 text-xs hover:bg-muted",
                date.getMonth() !== currentMonth.getMonth() &&
                  "text-muted-foreground/50",
                isSameDay(date, today) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                isSameDay(date, selectedDate) &&
                  !isSameDay(date, today) &&
                  "bg-muted"
              )}
            >
              {date.getDate()}
            </Button>
          ))}
        </div>
      </div>

      {/* Search People - desktop only */}
      {!isMobile && (
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 mt-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search for people</span>
        </div>
      )}

      {/* Calendars Section */}
      <div className="space-y-2 mt-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">My calendars</span>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>

        <div className="space-y-1">
          {calendars?.map((calendar) => (
            <div 
              key={calendar._id} 
              className="flex items-center gap-2 px-1 py-1.5 rounded-sm hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-2 flex-1">
                <Checkbox
                  checked={visibleCalendars.has(calendar._id)}
                  onCheckedChange={() => toggleCalendarVisibility(calendar._id)}
                  style={{ 
                    backgroundColor: visibleCalendars.has(calendar._id) ? calendar.color || "#000000" : "transparent",
                    borderColor: calendar.color || "#000000"
                  }}
                />
                <span className="flex-1 text-sm truncate">{calendar.name}</span>
              </div>
              <div className={cn(
                "transition-opacity flex items-center gap-1",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <input
                  type="color"
                  value={calendar.color || "#000000"}
                  onChange={(e) => updateColor(calendar._id, e.target.value)}
                  className="h-4 w-4 rounded-sm border-none bg-transparent p-0 cursor-pointer"
                  title="Change calendar color"
                />
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Other calendars</span>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {/* Time Format Controls */}
      <div className="mt-4 space-y-2">
        <Separator />
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onToggleTimeFormat}
          >
            {use24Hour ? (
              <Clock12 className="h-4 w-4 mr-2" />
            ) : (
              <Clock2 className="h-4 w-4 mr-2" />
            )}
            {use24Hour ? "12h" : "24h"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onToggleHourRange}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            {showAllHours ? "Work hours" : "All hours"}
          </Button>
        </div>
      </div>
    </div>
  );
}
