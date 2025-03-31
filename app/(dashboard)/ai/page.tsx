"use client";

import { useState, useRef, useEffect } from "react";
import { AiPromptInput } from "@/components/ai/AiPromptInput";
import { AiSuggestionCard } from "@/components/ai/AiSuggestionCard";
import { sendChatMessage, ChatMessage as ApiChatMessage } from "@/lib/services/ai-service";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useDocuments } from "@/lib/context/DocumentContext";
import { ContextDebug } from "@/components/ai/ContextDebug";

const suggestions = [
  {
    id: "1",
    title: "Draft a page for project planning",
    description: "",
    icon: "📄",
  },
  {
    id: "2",
    title: "Summarize the projects I'm currently working on",
    description: "",
    icon: "📊",
  },
  {
    id: "3",
    title: "Create a simple table ranking top movies",
    description: "",
    icon: "📋",
  },
  {
    id: "4",
    title: "Suggest a reading list of books, docs, or articles",
    description: "",
    icon: "💡",
  },
];

type Message = {
  role: "user" | "ai" | "system";
  content: string;
};

// Custom hook for safely accessing document context
function useSafeDocuments() {
  try {
    return useDocuments();
  } catch {
    return null;
  }
}

export default function AIPage() {
  const [hasPrompted, setHasPrompted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptWidth, setPromptWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);
  
  // Access document context safely
  const documentContext = useSafeDocuments();

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;
    if (!hasPrompted) setHasPrompted(true);

    // Add user message to the chat
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);

    try {
      // Format messages for OpenAI API
      const formattedMessages: ApiChatMessage[] = messages
        .map(msg => ({
          role: msg.role === "ai" ? "assistant" as const : msg.role as "user" | "system",
          content: msg.content
        }))
        .concat({
          role: "user" as const,
          content: prompt
        });

      // Get current document context
      let context: string | undefined;
      if (contextEnabled && documentContext) {
        const currentContext = documentContext.getCurrentContext();
        if (currentContext) {
          context = currentContext;
        }
      }

      // Get AI response
      const aiResponse = await sendChatMessage(formattedMessages, context);
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: aiResponse.content }
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Optionally show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!promptRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPromptWidth(entry.contentRect.width);
      }
    });

    observer.observe(promptRef.current);

    return () => observer.disconnect();
  }, []);

  const getCurrentDocumentTitle = () => {
    if (!documentContext) return null;
    
    const currentContext = documentContext.getCurrentContext();
    if (!currentContext) return null;
    
    // Find the document that matches the context
    const doc = documentContext.documents.find(doc => currentContext.startsWith(doc.title));
    return doc?.title || "Current document";
  };
  
  const hasActiveContext = () => {
    return contextEnabled && documentContext && documentContext.getCurrentContext() !== null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-1px)] w-full">
      <div
        className={`flex-1 w-full ${
          hasPrompted
            ? "overflow-y-auto px-4 pt-8 pb-32"
            : "flex items-center justify-center"
        }`}
      >
        {!hasPrompted ? (
          <div className="flex flex-col items-center justify-center w-full px-4">
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200 dark:bg-pink-600">
                <span className="text-2xl">🧠</span>
              </div>
              <h1 className="text-2xl font-semibold text-foreground text-center">
                How can I help you today?
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Powered by GPT-4o-mini
              </p>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showDebug}
                  onChange={() => setShowDebug(!showDebug)}
                  className="h-4 w-4"
                />
                Show context debug
              </label>
              {showDebug && <ContextDebug />}
            </div>

            <div className="w-full max-w-[750px]" ref={promptRef}>
              <AiPromptInput 
                onSubmit={handleSubmit} 
                contextEnabled={contextEnabled}
                onToggleContext={setContextEnabled}
              />
            </div>

            <div
              className="mt-8 mx-auto"
              style={{ width: promptWidth }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {suggestions.map((suggestion) => (
                  <AiSuggestionCard 
                    key={suggestion.id} 
                    {...suggestion} 
                    onClick={() => handleSubmit(suggestion.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full mx-auto space-y-6">
            {hasActiveContext() && (
              <div className="text-center text-xs text-muted-foreground py-1 border-b border-border mb-4">
                Using context from: {getCurrentDocumentTitle()}
              </div>
            )}
            {showDebug && contextEnabled && <ContextDebug />}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.role === "user"
                    ? "flex justify-end ml-auto"
                    : "flex justify-start mr-auto"
                }`}
              >
                <div 
                  className={`text-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-lg px-4 py-3"
                      : "bg-card border border-border rounded-lg px-4 py-3"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mr-auto">
                <div className="text-sm max-w-[85%] border border-border px-4 py-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasPrompted && (
        <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border">
          <div className="max-w-[750px] mx-auto px-4 py-4 relative" ref={promptRef}>
            {showDebug && contextEnabled && <ContextDebug />}
            <AiPromptInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              contextEnabled={contextEnabled}
              onToggleContext={setContextEnabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}