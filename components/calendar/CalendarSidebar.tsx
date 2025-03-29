"use client";

import React from "react";
import { format, addMonths, subMonths, isSameDay, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Plus, Calendar, Clock2, Clock12, EyeOff } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  use24Hour?: boolean;
  onToggleTimeFormat: () => void;
  showAllHours?: boolean;
  onToggleHourRange: () => void;
}

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  use24Hour = false,
  onToggleTimeFormat,
  showAllHours = true,
  onToggleHourRange,
}: CalendarSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendars = useQuery(api.calendar.queries.getCalendars, { userId: "skip" });
  const today = startOfToday();

  const daysInMonth = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - currentMonth.getDay() + 1);
    return date;
  });

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="w-64 border-l bg-muted/10 p-4 flex flex-col h-full">
      {/* Add Calendar Button */}
      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
        <Plus className="h-4 w-4" />
        <Calendar className="h-4 w-4" />
        Add calendar
      </Button>

      {/* Mini Calendar */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
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
                date.getMonth() !== currentMonth.getMonth() && "text-muted-foreground/50",
                isSameDay(date, today) && "bg-primary text-primary-foreground hover:bg-primary/90",
                isSameDay(date, selectedDate) && !isSameDay(date, today) && "bg-muted"
              )}
            >
              {date.getDate()}
            </Button>
          ))}
        </div>
      </div>

      {/* Search People */}
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 mt-4">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search for people</span>
      </div>

      {/* Calendars Section */}
      <div className="space-y-2 mt-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">My calendars</span>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
        
        <div className="space-y-1">
          {calendars?.map((calendar) => (
            <div key={calendar._id} className="flex items-center gap-2 px-1 py-0.5">
              <div 
                className="h-3 w-3 rounded-sm" 
                style={{ backgroundColor: calendar.color || 'hsl(var(--primary))' }}
              />
              <span className="flex-1 text-sm">{calendar.name}</span>
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
            {use24Hour ? <Clock12 className="h-4 w-4 mr-2" /> : <Clock2 className="h-4 w-4 mr-2" />}
            {use24Hour ? "12h" : "24h"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onToggleHourRange}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            {showAllHours ? "Work Hours" : "All Hours"}
          </Button>
        </div>
      </div>
    </div>
  );
} 