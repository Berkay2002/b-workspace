"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Database, Paperclip, AtSign, FileText, X, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useDocuments } from "@/lib/context/DocumentContext";
import { useCalendar } from "@/lib/hooks/use-calendar";
import { usePages } from "@/lib/hooks/use-pages";
import { MentionDropdown } from "./mention/MentionDropdown";
import type { MentionOption } from "./mention/MentionDropdown";
import { ContextPanel } from "./context/ContextPanel";
import { CalendarSettings } from "./settings/CalendarSettings";
import { getCaretCoordinates, adjustPositionToViewport } from "./utils/cursorUtils";

interface AiPromptInputProps {
  onSubmit?: (prompt: string) => void;
  isLoading?: boolean;
  contextEnabled?: boolean;
  onToggleContext?: (enabled: boolean) => void;
}

export function AiPromptInput({ 
  onSubmit, 
  isLoading = false, 
  contextEnabled = true,
  onToggleContext
}: AiPromptInputProps) {
  const [prompt, setPrompt] = React.useState("");
  const [showContextPanel, setShowContextPanel] = React.useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);
  const [showMentions, setShowMentions] = React.useState(false);
  const [mentionPosition, setMentionPosition] = React.useState({ top: 0, left: 0 });
  const [mentionSearch, setMentionSearch] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const mentionDropdownRef = React.useRef<HTMLDivElement>(null);

  const documents = useDocuments();
  const { events, calendarEnabled, toggleCalendarAccess } = useCalendar();
  const { pages } = usePages();

  const showMentionDropdown = (position: number, search: string = "") => {
    if (!textareaRef.current) return;

    const caretCoords = getCaretCoordinates(textareaRef.current, position);
    const textareaRect = textareaRef.current.getBoundingClientRect();
    const dropdownTop = textareaRect.top + caretCoords.top + 24;
    const dropdownLeft = textareaRect.left + caretCoords.left;

    const adjustedPosition = adjustPositionToViewport(
      { top: dropdownTop, left: dropdownLeft },
      280,
      250
    );

    setMentionPosition(adjustedPosition);
    setMentionSearch(search);
    setShowMentions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    const beforeCursor = value.slice(0, position);

    setPrompt(value);
    setCursorPosition(position);

    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    if (mentionMatch && textareaRef.current) {
      const search = mentionMatch[1] || "";
      showMentionDropdown(position - search.length - 1, search);
    } else {
      setShowMentions(false);
    }
  };

  React.useEffect(() => {
    if (showMentions && mentionDropdownRef.current) {
      const dropdown = mentionDropdownRef.current;
      const dropdownRect = dropdown.getBoundingClientRect();

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let needsAdjustment = false;
      let newTop = mentionPosition.top;
      let newLeft = mentionPosition.left;

      if (dropdownRect.bottom > viewportHeight) {
        newTop = mentionPosition.top - dropdownRect.height - 30;
        needsAdjustment = true;
      }

      if (dropdownRect.right > viewportWidth) {
        newLeft = viewportWidth - dropdownRect.width - 20;
        needsAdjustment = true;
      }

      if (needsAdjustment) {
        setMentionPosition({ top: newTop, left: newLeft });
      }
    }
  }, [showMentions, mentionPosition]);

  const handleMentionSelect = (option: MentionOption) => {
    const beforeMention = prompt.slice(0, cursorPosition).replace(/@\\w*$/, '');
    const afterMention = prompt.slice(cursorPosition);
    const newPrompt = beforeMention + option.value + ' ' + afterMention;

    setPrompt(newPrompt);
    setShowMentions(false);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPosition = beforeMention.length + option.value.length + 1;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onSubmit?.(prompt);
    setPrompt("");
  };

  const handleClearContext = () => {
    if (!documents) return;
    documents.setCurrentContext(null);
  };

  const getCurrentDocumentTitle = () => {
    if (!documents) return null;
    const context = documents.getCurrentContext();
    if (!context) return null;

    const doc = documents.documents.find(d => context.startsWith(d.title));
    return doc?.title || null;
  };

  const activeDocument = getCurrentDocumentTitle();

  const handleAtButtonClick = () => {
    if (!textareaRef.current) return;

    const position = textareaRef.current.selectionStart || 0;
    const beforeCursor = prompt.slice(0, position);
    const afterCursor = prompt.slice(position);
    const newPrompt = beforeCursor + '@' + afterCursor;

    setPrompt(newPrompt);

    const newPosition = position + 1;
    textareaRef.current.focus();

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        showMentionDropdown(newPosition - 1);
      }
    }, 10);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-xl border border-muted bg-background shadow-sm">
        {documents && contextEnabled && activeDocument && (
          <div className="flex items-center px-4 pt-3 pb-1">
            <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              {activeDocument}
              <button 
                type="button" 
                onClick={handleClearContext}
                className="ml-1 hover:text-primary-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="Ask AI anything..."
          value={prompt}
          onChange={handleInputChange}
          className={`min-h-[100px] resize-none border-0 bg-transparent px-4 ${activeDocument ? 'pt-2' : 'pt-4'} focus-visible:ring-0`}
          disabled={isLoading}
        />

        {showMentions && (
          <MentionDropdown
            ref={mentionDropdownRef}
            position={mentionPosition}
            mentionSearch={mentionSearch}
            pages={pages}
            events={events}
            calendarEnabled={calendarEnabled}
            onSelect={handleMentionSelect}
          />
        )}

        <div className="flex items-center justify-between border-t px-4 py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            {documents && (
              <button 
                type="button" 
                onClick={() => setShowContextPanel(!showContextPanel)}
                className="text-xs flex items-center gap-1 border rounded-md px-2 py-1 hover:bg-muted transition-colors"
              >
                <FileText className="w-3 h-3" /> 
                {activeDocument ? 'Change' : 'Add'} Context
                {showContextPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
            <button 
              type="button" 
              className="text-xs flex items-center gap-1 border rounded-md px-2 py-1 hover:bg-muted transition-colors"
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            >
              <Calendar className="w-3 h-3" /> 
              {calendarEnabled ? 'Calendar On' : 'Calendar Off'}
              {showSettingsPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button type="button" className="text-sm flex items-center gap-1">
              <Database className="w-4 h-4" /> All sources
            </button>
            <Paperclip className="w-4 h-4" />
            <button 
              type="button" 
              className="text-sm flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={handleAtButtonClick}
            >
              <AtSign className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="text-muted-foreground disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-r-transparent" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.6667 1.33333L7.33333 8.66666M14.6667 1.33333L10 14.6667L7.33333 8.66666M14.6667 1.33333L1.33333 6L7.33333 8.66666"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {showSettingsPanel && (
          <CalendarSettings
            calendarEnabled={calendarEnabled}
            onToggleCalendarAccess={toggleCalendarAccess}
            onClose={() => setShowSettingsPanel(false)}
          />
        )}

        {showContextPanel && (
          <ContextPanel
            contextEnabled={contextEnabled}
            onToggleContext={onToggleContext || (() => {})}
            onClose={() => setShowContextPanel(false)}
          />
        )}
      </div>
    </form>
  );
}