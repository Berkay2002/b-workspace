"use client";

import React from "react";
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
import { Clock, MapPin } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
}

export function CalendarGrid({
  currentDate,
  events,
  use24Hour = false,
  showAllHours = true,
}: CalendarGridProps) {
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
    return events
      .filter((event) => {
        const eventStart = new Date(event.startTime);
        return isSameDay(eventStart, day);
      })
      .sort((a, b) => a.startTime - b.startTime);
  };

  const calculateEventPosition = (
    event: CalendarEvent,
    allDayEvents: CalendarEvent[]
  ) => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    const dayStart = setHours(eventStart, startHour);

    const minutesFromDayStart = differenceInMinutes(eventStart, dayStart);
    const topPercentage =
      (minutesFromDayStart / (60 * (endHour - startHour + 1))) * 100;

    const durationMinutes = differenceInMinutes(eventEnd, eventStart);
    const heightPercentage =
      (durationMinutes / (60 * (endHour - startHour + 1))) * 100;

    const overlappingEvents = allDayEvents.filter(
      (otherEvent) =>
        otherEvent._id !== event._id &&
        areIntervalsOverlapping(
          { start: new Date(event.startTime), end: new Date(event.endTime) },
          {
            start: new Date(otherEvent.startTime),
            end: new Date(otherEvent.endTime),
          }
        )
    );

    const column =
      overlappingEvents.length > 0
        ? overlappingEvents.filter((e) => e.startTime < event.startTime).length
        : 0;
    const totalColumns = overlappingEvents.length + 1;

    const width = `${100 / totalColumns}%`;
    const left = `${(column * 100) / totalColumns}%`;

    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      backgroundColor: event.calendarColor || "hsl(var(--primary))",
      width,
      left,
    };
  };

  const formatTime = (date: Date) => {
    return format(date, use24Hour ? "HH:mm" : "h:mm a");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header row */}
      <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b">
        <div className="p-2" />
        {weekDays.map((day) => (
          <div key={day.toString()} className="p-2 text-center border-l">
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-sm text-muted-foreground">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      {/* Grid content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[4rem_repeat(7,1fr)] h-full">
          {/* Time column */}
          <div className="flex flex-col border-r">
            {hours.map((hour) => (
              <div
                key={hour.toString()}
                className="min-h-[4rem] p-2 text-right text-sm text-muted-foreground border-t"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);

            return (
              <div key={day.toString()} className="relative border-l border-t">
                {/* Hour background rows */}
                {hours.map((hour) => (
                  <div key={hour.toString()} className="min-h-[4rem] border-t" />
                ))}

                {/* Events positioned absolutely */}
                {dayEvents.map((event) => (
                  <Popover key={event._id}>
                    <PopoverTrigger asChild>
                      <Card
                        className="absolute cursor-pointer p-2 text-xs hover:bg-muted/50 overflow-hidden"
                        style={calculateEventPosition(event, dayEvents)}
                      >
                        <div className="flex flex-col h-full">
                          <span className="font-medium text-background truncate">
                            {event.title}
                          </span>
                          <span className="text-background/90 text-[10px]">
                            {formatTime(new Date(event.startTime))}
                          </span>
                        </div>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(new Date(event.startTime))} -{" "}
                              {formatTime(new Date(event.endTime))}
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
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
