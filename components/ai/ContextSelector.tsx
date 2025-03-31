"use client";

import { useState } from "react";
import { useDocuments } from "@/lib/context/DocumentContext";
import { nanoid } from "nanoid";

export function ContextSelector() {
  const documents = useDocuments();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"note" | "task" | "page" | "meeting">("note");
  
  if (!documents) {
    return null;
  }
  
  const handleAddDocument = () => {
    if (!title.trim() || !content.trim()) return;
    
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
  };
  
  const handleSelectDocument = (id: string) => {
    documents.setCurrentContext(id);
  };
  
  const clearContext = () => {
    documents.setCurrentContext(null);
  };
  
  return (
    <div className="border rounded-md p-4 space-y-4 mb-4">
      <h3 className="text-sm font-medium">Document Contexts</h3>
      
      <div className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          className="w-full px-3 py-1 text-sm border rounded"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Document content"
          className="w-full px-3 py-1 text-sm border rounded h-20 resize-none"
        />
        
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "note" | "task" | "page" | "meeting")}
          className="w-full px-3 py-1 text-sm border rounded"
        >
          <option value="note">Note</option>
          <option value="task">Task List</option>
          <option value="page">Page</option>
          <option value="meeting">Meeting Notes</option>
        </select>
        
        <button
          onClick={handleAddDocument}
          disabled={!title.trim() || !content.trim()}
          className="w-full py-1 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Add Document Context
        </button>
      </div>
      
      {documents.documents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium mb-2">Available Contexts:</h4>
          <div className="space-y-2 max-h-40 overflow-auto">
            {documents.documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-2 text-xs rounded cursor-pointer flex justify-between items-center ${
                  documents.getCurrentContext()?.startsWith(doc.id)
                    ? "bg-primary/10 font-medium"
                    : "bg-muted/50 hover:bg-muted"
                }`}
                onClick={() => handleSelectDocument(doc.id)}
              >
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-muted-foreground text-[10px]">{doc.type}</div>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {doc.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={clearContext}
            className="w-full mt-2 py-1 text-xs border rounded"
          >
            Clear Active Context
          </button>
        </div>
      )}
    </div>
  );
} 