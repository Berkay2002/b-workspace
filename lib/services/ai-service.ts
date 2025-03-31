export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  role: "assistant";
  content: string;
}

export async function sendChatMessage(
  messages: ChatMessage[], 
  context?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        messages,
        context
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get AI response");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
} 