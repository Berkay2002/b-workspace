import * as React from "react";
import { Page } from "@/lib/hooks/use-pages";
import { CalendarEvent } from "@/lib/hooks/use-calendar";

export interface MentionOption {
  type: MentionType;
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

export type MentionType = "page" | "date";

interface MentionDropdownProps {
  position: { top: number; left: number };
  mentionSearch: string;
  pages: Page[];
  events: CalendarEvent[];
  calendarEnabled: boolean;
  onSelect: (option: MentionOption) => void;
}

export const MentionDropdown = React.forwardRef<HTMLDivElement, MentionDropdownProps>(
  ({ position, mentionSearch, pages, events, calendarEnabled, onSelect }, ref) => {
    const { pageOptions, dateOptions } = getMentionOptions(mentionSearch, pages, events, calendarEnabled);
    const hasPageOptions = pageOptions.length > 0;
    const hasDateOptions = dateOptions.length > 0;

    if (!hasPageOptions && !hasDateOptions) {
      return null;
    }

    return (
      <div 
        ref={ref}
        className="fixed z-50 w-64 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto"
        style={{ 
          top: position.top, 
          left: position.left
        }}
      >
        {/* Pages section */}
        {hasPageOptions && (
          <div>
            <div className="px-3 py-1 text-xs text-muted-foreground bg-muted/30 font-medium border-b">
              Link to page
            </div>
            <div className="max-h-32 overflow-y-auto">
              {pageOptions.map((option, index) => (
                <button
                  key={`page-${index}`}
                  type="button"
                  onClick={() => onSelect(option)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{option.icon}</span>
                  <span className="flex-1 truncate">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date section */}
        {hasDateOptions && (
          <div className={hasPageOptions ? "border-t" : ""}>
            <div className="px-3 py-1 text-xs text-muted-foreground bg-muted/30 font-medium border-b">
              Date
            </div>
            <div className="max-h-32 overflow-y-auto">
              {dateOptions.map((option, index) => (
                <button
                  key={`date-${index}`}
                  type="button"
                  onClick={() => onSelect(option)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{option.icon}</span>
                  <div className="flex flex-col">
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.description === "Event" && (
                      <span className="text-xs text-muted-foreground">Calendar event</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasPageOptions && !hasDateOptions && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No matching results
          </div>
        )}
      </div>
    );
  }
);

MentionDropdown.displayName = "MentionDropdown";

// Helper function to generate mention options
function getMentionOptions(
  mentionSearch: string, 
  pages: Page[], 
  events: CalendarEvent[], 
  calendarEnabled: boolean
) {
  const pageOptions: MentionOption[] = [];
  const dateOptions: MentionOption[] = [];

  // Add pages
  if (pages) {
    pages.forEach((page: Page) => {
      if (page.title.toLowerCase().includes(mentionSearch.toLowerCase())) {
        pageOptions.push({
          type: "page" as const,
          label: page.title,
          value: `@${page.title}`,
          icon: "📝",
          description: "Page"
        });
      }
    });
  }

  // Add date suggestions
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate next Tuesday 3PM
  const nextTuesday = new Date(today);
  nextTuesday.setDate(today.getDate() + ((9 - today.getDay()) % 7) + 1);
  nextTuesday.setHours(15, 0, 0, 0);

  const dateLabels = ["Today", "Tomorrow", "Next Tuesday 3PM"];
  const dateValues = [
    today.toLocaleDateString(),
    tomorrow.toLocaleDateString(),
    nextTuesday.toLocaleString()
  ];

  dateLabels.forEach((label, i) => {
    if (label.toLowerCase().includes(mentionSearch.toLowerCase())) {
      dateOptions.push({
        type: "date",
        label,
        value: `@${dateValues[i]}`,
        icon: "📅",
        description: "Date"
      });
    }
  });

  // Add upcoming events if calendar access is enabled
  if (calendarEnabled && events) {
    events.forEach((event: CalendarEvent) => {
      const eventDate = new Date(event.startTime);
      const eventLabel = event.title;
      if (eventLabel.toLowerCase().includes(mentionSearch.toLowerCase())) {
        dateOptions.push({
          type: "date",
          label: eventLabel,
          value: `@${eventDate.toLocaleString()} - ${event.title}`,
          icon: "⏰",
          description: "Event"
        });
      }
    });
  }

  return { pageOptions, dateOptions };
} 