import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement file upload logic
      console.log("File upload:", file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] w-full resize-none rounded-lg border bg-background px-4 py-[1.3rem] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isLoading || isUploading}
            >
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading || isUploading}
                />
                <Paperclip className="h-4 w-4" />
              </label>
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8"
              disabled={!message.trim() || isLoading || isUploading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
} 