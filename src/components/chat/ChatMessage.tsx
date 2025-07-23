import { Button } from "@/components/ui/button";
import { Share2, AlertTriangle } from "lucide-react";
import { CredibilityScore } from "./CredibilityScore";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  credibilityScore?: number;
  isEmergency?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onShare: () => void;
}

export const ChatMessage = ({ message, onShare }: ChatMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-card ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : message.isEmergency
              ? 'bg-destructive/10 border border-destructive/20'
              : 'bg-chat-ai'
          }`}
        >
          {message.isEmergency && (
            <div className="flex items-center gap-2 mb-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Emergency Alert</span>
            </div>
          )}
          
          <p className={`text-sm leading-relaxed ${
            isUser ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {message.content}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs ${
                isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              
              {message.credibilityScore && (
                <CredibilityScore score={message.credibilityScore} />
              )}
            </div>
            
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className={`h-6 px-2 ${
                  message.isEmergency 
                    ? 'text-destructive hover:text-destructive' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};