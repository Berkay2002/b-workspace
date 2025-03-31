import * as React from "react";
import { X, Plus } from "lucide-react";
import { useDocuments } from "@/lib/context/DocumentContext";

interface ContextPanelProps {
  contextEnabled: boolean;
  onToggleContext: (enabled: boolean) => void;
  onClose: () => void;
}

export function ContextPanel({ contextEnabled, onToggleContext, onClose }: ContextPanelProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [type, setType] = React.useState<"note" | "task" | "page" | "meeting">("note");
  
  const documents = useDocuments();
  
  if (!documents) {
    return null;
  }

  const handleAddDocument = () => {
    if (!title.trim() || !content.trim()) return;
    
    const document = {
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
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
    onClose();
  };

  const handleSelectDocument = (id: string) => {
    documents.setCurrentContext(id);
  };

  return (
    <div className="absolute left-0 bottom-full w-full bg-background border rounded-t-md rounded-b-none border-b-0 shadow-lg z-10 p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium">Document Contexts</h3>
        <button 
          type="button"
          onClick={onClose} 
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
            onChange={() => onToggleContext(!contextEnabled)}
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
  );
} 