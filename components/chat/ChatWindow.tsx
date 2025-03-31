import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatThread } from "./ChatThread";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { TypingIndicator } from "./TypingIndicator";
import { sendChatMessage, ChatMessage as ApiChatMessage } from "@/lib/services/ai-service";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
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
      // Format messages for OpenAI API
      const chatMessages: ApiChatMessage[] = messages.concat(newMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      const aiResponse = await sendChatMessage(chatMessages);
      
      const formattedResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, formattedResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      // Optionally add an error message to the chat
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