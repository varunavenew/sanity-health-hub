import { Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tag {
  label: string;
  path: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  tags?: Tag[];
}

interface ChatBubbleProps {
  message: Message;
  onTagClick?: (path: string) => void;
}

export const ChatBubble = ({ message, onTagClick }: ChatBubbleProps) => {
  const isAI = message.sender === "ai";

  return (
    <div
      className={`flex gap-3 animate-slide-up ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isAI ? "" : "flex flex-col items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAI
              ? "bg-[hsl(var(--chat-ai-bubble))] text-[hsl(var(--chat-foreground))]"
              : "bg-[hsl(var(--chat-user-bubble))] text-[hsl(var(--foreground))]"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        {/* Tags */}
        {isAI && message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.tags.map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onTagClick?.(tag.path)}
                className="h-7 text-xs bg-[hsl(var(--chat-ai-bubble))]/50 hover:bg-[hsl(var(--chat-ai-bubble))] border-[hsl(var(--chat-border))] transition-all"
              >
                {tag.label}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};
