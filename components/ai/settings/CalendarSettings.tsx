import * as React from "react";
import { X } from "lucide-react";

interface CalendarSettingsProps {
  calendarEnabled: boolean;
  onToggleCalendarAccess: (enabled: boolean) => void;
  onClose: () => void;
}

export function CalendarSettings({ 
  calendarEnabled, 
  onToggleCalendarAccess, 
  onClose 
}: CalendarSettingsProps) {
  return (
    <div className="absolute left-0 bottom-full w-full bg-background border rounded-t-md rounded-b-none border-b-0 shadow-lg z-10 p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium">AI Calendar Access</h3>
        <button 
          type="button"
          onClick={onClose} 
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={calendarEnabled}
            onChange={() => onToggleCalendarAccess(!calendarEnabled)}
            className="h-4 w-4"
          />
          <span>Allow AI to access calendar</span>
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          When enabled, the AI can see your calendar events and suggest times based on your schedule.
          The AI has read-only access and cannot modify your calendar.
        </p>
      </div>
    </div>
  );
} 