import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatThreadProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && <div ref={bottomRef} />}
      </div>
    </div>
  );
} 