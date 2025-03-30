"use client";

import React, { useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  isSameDay,
  setHours,
  setMinutes,
  differenceInMinutes,
  areIntervalsOverlapping,
} from "date-fns";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalendarEvent extends Doc<"events"> {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  url?: string;
  userId: string;
  calendarColor?: string;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  use24Hour?: boolean;
  showAllHours?: boolean;
  onNextWeek?: () => void;
  onPreviousWeek?: () => void;
}

function assignEventColumns(events: CalendarEvent[]) {
  const sorted = [...events].sort((a, b) => a.startTime - b.startTime);
  const positioned: (CalendarEvent & { column: number; totalColumns: number })[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const overlaps: CalendarEvent[] = [current];

    for (let j = i + 1; j < sorted.length; j++) {
      const next = sorted[j];

      const overlapsInTime = areIntervalsOverlapping(
        { start: new Date(current.startTime), end: new Date(current.endTime) },
        { start: new Date(next.startTime), end: new Date(next.endTime) }
      );

      if (overlapsInTime) {
        overlaps.push(next);
      }
    }

    overlaps.forEach((event, index) => {
      const alreadyPositioned = positioned.find((e) => e._id === event._id);
      if (!alreadyPositioned) {
        positioned.push({
          ...event,
          column: index,
          totalColumns: overlaps.length,
        });
      }
    });
  }

  return positioned;
}

export function CalendarGrid({
  currentDate,
  events,
  use24Hour = false,
  showAllHours = true,
  onNextWeek,
  onPreviousWeek,
}: CalendarGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

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

  const weekStart = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart),
  });

  const startHour = showAllHours ? 0 : 4;
  const endHour = showAllHours ? 23 : 21;

  const hours = eachHourOfInterval({
    start: setMinutes(setHours(weekStart, startHour), 0),
    end: setMinutes(setHours(weekStart, endHour), 59),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), day));
  };

  const formatTime = (date: Date) => {
    return format(date, use24Hour ? "HH:mm" : "h:mm a");
  };

  const handlePreviousWeek = () => {
    if (onPreviousWeek) {
      setAnimationDirection('right');
      setTimeout(() => {
        onPreviousWeek();
        setTimeout(() => setAnimationDirection(null), 50);
      }, 150);
    }
  };

  const handleNextWeek = () => {
    if (onNextWeek) {
      setAnimationDirection('left');
      setTimeout(() => {
        onNextWeek();
        setTimeout(() => setAnimationDirection(null), 50);
      }, 150);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Week navigation for mobile */}
      {isMobile && (
        <div className="flex items-center justify-between border-b p-2 bg-background/80 sticky top-0 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePreviousWeek}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs">Previous</span>
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, "MMM d")} - {format(endOfWeek(weekStart), "MMM d, yyyy")}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextWeek}
            className="flex items-center gap-1"
          >
            <span className="text-xs">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className={cn(
        "grid border-b transition-transform duration-150",
        animationDirection === 'left' && "translate-x-[-5%] opacity-0",
        animationDirection === 'right' && "translate-x-[5%] opacity-0",
        isMobile 
          ? "grid-cols-[3rem_repeat(7,1fr)]" 
          : "grid-cols-[4rem_repeat(7,1fr)]"
      )}>
        <div className={cn("p-2", isMobile ? "text-[10px]" : "")} />
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={cn(
              "border-l text-center", 
              isMobile ? "p-1" : "p-2"
            )}
          >
            <div className={cn("font-medium", isMobile ? "text-xs" : "")}>{format(day, "EEE")}</div>
            <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <div className={cn(
          "grid h-full",
          animationDirection === 'left' && "translate-x-[-5%] opacity-0",
          animationDirection === 'right' && "translate-x-[5%] opacity-0",
          "transition-transform duration-150",
          isMobile 
            ? "grid-cols-[3rem_repeat(7,1fr)]" 
            : "grid-cols-[4rem_repeat(7,1fr)]"
        )}>
          {/* Hour labels */}
          <div className="flex flex-col border-r">
            {hours.map((hour) => (
              <div
                key={hour.toString()}
                className={cn(
                  "p-2 text-right text-muted-foreground border-t",
                  isMobile 
                    ? "min-h-[3rem] text-[10px]" 
                    : "min-h-[4rem] text-sm"
                )}
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const positionedEvents = assignEventColumns(dayEvents);

            return (
              <div key={day.toString()} className="relative border-l border-t">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div key={hour.toString()} className={cn(
                    "border-t",
                    isMobile ? "min-h-[3rem]" : "min-h-[4rem]"
                  )} />
                ))}

                {/* Render events */}
                {positionedEvents.map((event) => {
                  const eventStart = new Date(event.startTime);
                  const eventEnd = new Date(event.endTime);
                  const dayStart = setHours(setMinutes(new Date(eventStart), 0), startHour);

                  const minutesFromStart = differenceInMinutes(eventStart, dayStart);
                  const duration = differenceInMinutes(eventEnd, eventStart);

                  const top = `${(minutesFromStart / (60 * (endHour - startHour + 1))) * 100}%`;
                  const height = `${(duration / (60 * (endHour - startHour + 1))) * 100}%`;

                  const width = `calc(${100 / event.totalColumns}% - 2px)`;
                  const left = `calc(${(100 / event.totalColumns) * event.column}% + 1px)`;

                  return (
                    <Popover key={event._id}>
                      <PopoverTrigger asChild>
                        <Card
                          className={cn(
                            "absolute cursor-pointer overflow-hidden",
                            isMobile ? "p-1 text-[8px]" : "p-2 text-xs"
                          )}
                          style={{ 
                            top, 
                            height, 
                            width, 
                            left,
                            backgroundColor: event.calendarColor || "#4F46E5"
                          }}
                        >
                          <div className="flex flex-col h-full">
                            <span className="font-medium text-background truncate">
                              {event.title}
                            </span>
                            {!isMobile && (
                              <span className="text-background/90 text-[10px]">
                                {formatTime(new Date(event.startTime))}
                              </span>
                            )}
                          </div>
                        </Card>
                      </PopoverTrigger>
                      <PopoverContent className={cn(
                        isMobile ? "w-64" : "w-80"
                      )}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: event.calendarColor || "#4F46E5" }}
                            />
                            <h4 className="font-medium">{event.title}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && <p className="mt-2">{event.description}</p>}
                            {event.url && (
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-sm text-primary hover:underline"
                              >
                                View Details
                              </a>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual hint for swiping on mobile */}
      {isMobile && (
        <div className="flex justify-center items-center gap-6 py-2 text-muted-foreground border-t">
          <div className="flex items-center gap-1 text-xs">
            <ChevronLeft className="h-4 w-4" />
            <span>Swipe for previous week</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Swipe for next week</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
}
