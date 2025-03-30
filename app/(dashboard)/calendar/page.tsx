"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  startOfToday, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks 
} from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { Sidebar } from "@/components/shared/Sidebar";
import { Menu, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [use24Hour, setUse24Hour] = useState(true);
  const [showAllHours, setShowAllHours] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState<Set<Id<"calendars">>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  
  // Refs for swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50; // Minimum swipe distance in pixels
  
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  
  const events = useQuery(api.calendar.queries.getEventsForDateRange, { 
    startDate: weekStart.getTime(),
    endDate: weekEnd.getTime(),
  });
  const calendars = useQuery(api.calendar.queries.getCalendars, { userId: "skip" });

  // Update visible calendars when new calendars are added
  useEffect(() => {
    if (calendars) {
      setVisibleCalendars(new Set(calendars.map(cal => cal._id)));
    }
  }, [calendars?.length]);

  // Filter events based on visible calendars
  const visibleEvents = events?.filter(event => visibleCalendars.has(event.calendarId)) || [];

  const handleToggleCalendar = (calendarId: Id<"calendars">) => {
    setVisibleCalendars(prev => {
      const next = new Set(prev);
      if (next.has(calendarId)) {
        next.delete(calendarId);
      } else {
        next.add(calendarId);
      }
      return next;
    });
  };

  // Handle week navigation
  const goToNextWeek = () => {
    setSelectedDate(date => addWeeks(date, 1));
  };

  const goToPreviousWeek = () => {
    setSelectedDate(date => subWeeks(date, 1));
  };

  // Swipe gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distanceX = touchEndX.current - touchStartX.current;
    const isSwipeSignificant = Math.abs(distanceX) > minSwipeDistance;
    
    if (isSwipeSignificant) {
      if (distanceX > 0) {
        // Swipe right - go to previous week
        goToPreviousWeek();
      } else {
        // Swipe left - go to next week
        goToNextWeek();
      }
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const closeMobileSettings = () => {
    setMobileSettingsOpen(false);
  };

  const closeAllMobilePanels = () => {
    setMobileMenuOpen(false);
    setMobileSettingsOpen(false);
  };

  // Determine if either sidebar is open to show backdrop
  const isSidebarOpen = mobileMenuOpen || mobileSettingsOpen;

  return (
    <>
      {/* Desktop view - with proper positioning to account for sidebar */}
      <div className="fixed left-56 right-0 top-0 bottom-0 hidden md:flex">
        <div className="flex-1 min-w-0">
          <CalendarGrid
            currentDate={selectedDate}
            events={visibleEvents}
            use24Hour={use24Hour}
            showAllHours={showAllHours}
            onNextWeek={goToNextWeek}
            onPreviousWeek={goToPreviousWeek}
          />
        </div>
        <CalendarSidebar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          use24Hour={use24Hour}
          onToggleTimeFormat={() => setUse24Hour(!use24Hour)}
          showAllHours={showAllHours}
          onToggleHourRange={() => setShowAllHours(!showAllHours)}
          visibleCalendars={visibleCalendars}
          onToggleCalendar={handleToggleCalendar}
        />
      </div>

      {/* Mobile view */}
      <div className="fixed inset-0 flex flex-col md:hidden">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Calendar</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Calendar with touch events */}
        <div 
          className="flex-1 overflow-hidden touch-pan-y"
          ref={calendarRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <CalendarGrid
            currentDate={selectedDate}
            events={visibleEvents}
            use24Hour={use24Hour}
            showAllHours={showAllHours}
            onNextWeek={goToNextWeek}
            onPreviousWeek={goToPreviousWeek}
          />
        </div>

        {/* Backdrop for mobile when sidebars are open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-in-out"
            onClick={closeAllMobilePanels}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Sidebar */}
        <div 
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card shadow-lg transform transition-transform duration-200 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="absolute top-3 right-3 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-background shadow-md"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Sidebar className="border-none shadow-none h-full" onClickItem={closeMobileMenu} />
        </div>

        {/* Mobile Settings Sidebar */}
        <div 
          className={cn(
            "fixed inset-y-0 right-0 z-50 bg-card shadow-lg transform transition-transform duration-200 ease-in-out",
            mobileSettingsOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="absolute top-3 left-3 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-background shadow-md"
              onClick={closeMobileSettings}
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CalendarSidebar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              closeMobileSettings();
            }}
            use24Hour={use24Hour}
            onToggleTimeFormat={() => setUse24Hour(!use24Hour)}
            showAllHours={showAllHours}
            onToggleHourRange={() => setShowAllHours(!showAllHours)}
            visibleCalendars={visibleCalendars}
            onToggleCalendar={handleToggleCalendar}
            className="border-none shadow-none h-full"
          />
        </div>
      </div>
    </>
  );
} 