"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Database, Paperclip, AtSign, FileText, X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useDocuments } from "@/lib/context/DocumentContext";
import { nanoid } from "nanoid";

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
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [type, setType] = React.useState<"note" | "task" | "page" | "meeting">("note");
  const documents = useDocuments();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onSubmit?.(prompt);
    setPrompt("");
  };

  const handleAddDocument = () => {
    if (!documents || !title.trim() || !content.trim()) return;
    
    const document = {
      id: nanoid(),
      title: title.trim(),
      content: content.trim(),
      type,
      lastUpdated: new Date()
    };
    
    documents.addDocument(document);
    documents.setCurrentContext(document.id);
    
    // Reset form
    setTitle("");
    setContent("");
    setShowContextPanel(false);
  };

  const handleSelectDocument = (id: string) => {
    if (!documents) return;
    documents.setCurrentContext(id);
  };

  const handleClearContext = () => {
    if (!documents) return;
    documents.setCurrentContext(null);
  };

  const handleToggleContext = () => {
    if (onToggleContext) {
      onToggleContext(!contextEnabled);
    }
  };

  const getCurrentDocumentTitle = () => {
    if (!documents) return null;
    const context = documents.getCurrentContext();
    if (!context) return null;
    
    const doc = documents.documents.find(d => context.startsWith(d.title));
    return doc?.title || null;
  };

  const activeDocument = getCurrentDocumentTitle();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-xl border border-muted bg-background shadow-sm">
        {/* Context indicator */}
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
          placeholder="Ask AI anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={`min-h-[100px] resize-none border-0 bg-transparent px-4 ${activeDocument ? 'pt-2' : 'pt-4'} focus-visible:ring-0`}
          disabled={isLoading}
        />

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
            <button type="button" className="text-sm flex items-center gap-1">
              <Database className="w-4 h-4" /> All sources
            </button>
            <Paperclip className="w-4 h-4" />
            <AtSign className="w-4 h-4" />
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

        {/* Context panel */}
        {showContextPanel && documents && (
          <div className="absolute left-0 bottom-full w-full bg-background border rounded-t-md rounded-b-none border-b-0 shadow-lg z-10 p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-medium">Document Contexts</h3>
              <button 
                type="button"
                onClick={() => setShowContextPanel(false)} 
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center mb-2">
              <label className="text-xs flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={contextEnabled}
                  onChange={handleToggleContext}
                  className="h-3 w-3"
                />
                <span className="text-muted-foreground">Enable context</span>
              </label>
            </div>

            {documents.documents.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-1">Available contexts:</div>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {documents.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-1.5 text-xs rounded cursor-pointer flex justify-between items-center ${
                        documents.getCurrentContext()?.startsWith(doc.title)
                          ? "bg-primary/10 font-medium"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div className="flex items-center">
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-muted-foreground text-[10px] ml-2 px-1 bg-muted/50 rounded">{doc.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Add new context:</div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="flex-1 px-2 py-1 text-xs border rounded"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "note" | "task" | "page" | "meeting")}
                  className="px-2 py-1 text-xs border rounded"
                >
                  <option value="note">Note</option>
                  <option value="task">Task</option>
                  <option value="page">Page</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="w-full px-2 py-1 text-xs border rounded h-16 resize-none"
              />
              <button
                type="button"
                onClick={handleAddDocument}
                disabled={!title.trim() || !content.trim()}
                className="w-full flex items-center justify-center py-1 text-xs bg-primary text-primary-foreground rounded disabled:opacity-50"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Document
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
