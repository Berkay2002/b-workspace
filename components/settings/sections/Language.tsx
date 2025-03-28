import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Tokyo", label: "Tokyo" },
];

const weekStarts = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
];

export function Language() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Language & Time</h3>
          <p className="text-sm text-muted-foreground">
            Set your preferred language and time settings
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="UTC">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Week starts on</Label>
            <Select defaultValue="sunday">
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {weekStarts.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 