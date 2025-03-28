import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatThread } from "./ChatThread";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // TODO: Implement AI response logic
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder response from the AI.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatThread messages={messages} isLoading={isLoading} />
        {isLoading && <TypingIndicator />}
      </div>
      {messages.length === 0 && <SuggestedPrompts onSelect={handleSendMessage} />}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
} 