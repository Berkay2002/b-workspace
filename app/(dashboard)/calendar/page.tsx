"use client";

import { useState } from "react";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { startOfToday } from "date-fns";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [use24Hour, setUse24Hour] = useState(true);
  const [showAllHours, setShowAllHours] = useState(false);
  const events = useQuery(api.calendar.queries.getUpcomingEvents, { limit: 1000 });

  return (
    <div className="fixed left-56 right-0 top-14 bottom-0 flex">
      <div className="flex-1 min-w-0">
        <CalendarGrid
          currentDate={selectedDate}
          events={events || []}
          use24Hour={use24Hour}
          showAllHours={showAllHours}
        />
      </div>
      <CalendarSidebar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        use24Hour={use24Hour}
        onToggleTimeFormat={() => setUse24Hour(!use24Hour)}
        showAllHours={showAllHours}
        onToggleHourRange={() => setShowAllHours(!showAllHours)}
      />
    </div>
  );
} 