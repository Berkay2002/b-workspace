"use client";

import { useState, useRef, useEffect } from "react";
import { AiPromptInput } from "@/components/ai/AiPromptInput";
import { AiSuggestionCard } from "@/components/ai/AiSuggestionCard";

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
  role: "user" | "ai";
  content: string;
};

export default function AIPage() {
  const [hasPrompted, setHasPrompted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptWidth, setPromptWidth] = useState(0);
  const promptRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim()) return;
    if (!hasPrompted) setHasPrompted(true);

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Hi Berkay! How can I help you today?" },
      ]);
    }, 500);
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
            </div>

            <div className="w-full max-w-[750px]" ref={promptRef}>
              <AiPromptInput onSubmit={handleSubmit} />
            </div>

            <div
              className="mt-8 mx-auto"
              style={{ width: promptWidth }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {suggestions.map((suggestion) => (
                  <AiSuggestionCard key={suggestion.id} {...suggestion} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  msg.role === "user"
                    ? "text-right ml-auto max-w-[75%] bg-muted rounded-lg px-3 py-2"
                    : "text-left mr-auto max-w-[75%] border border-border px-3 py-2 rounded-lg"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {hasPrompted && (
        <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border">
          <div className="max-w-[750px] mx-auto px-4 py-4" ref={promptRef}>
            <AiPromptInput onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}