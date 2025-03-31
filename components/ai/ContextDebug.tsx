"use client";

import { useDocuments } from "@/lib/context/DocumentContext";

export function ContextDebug() {
  const documents = useDocuments();
  
  if (!documents) {
    return <div className="text-xs text-muted-foreground">Document context not available</div>;
  }
  
  const context = documents.getCurrentContext();
  
  if (!context) {
    return <div className="text-xs text-muted-foreground">No active context</div>;
  }
  
  return (
    <div className="border rounded p-3 my-2 space-y-2">
      <div className="text-xs font-medium">Current Context:</div>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40 whitespace-pre-wrap">
        {context}
      </pre>
    </div>
  );
} 