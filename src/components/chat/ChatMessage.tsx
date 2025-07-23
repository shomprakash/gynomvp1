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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${isUser ? 'ml-4 sm:ml-12' : 'mr-4 sm:mr-12'}`}>
        <div
          className={`rounded-lg border backdrop-blur-sm px-4 py-3 shadow-neon font-mono text-sm ${
            isUser
              ? 'bg-primary/20 border-primary text-primary shadow-glow'
              : message.isEmergency
              ? 'bg-destructive/10 border-destructive/50 text-destructive shadow-[0_0_20px_hsl(0_100%_50%/0.3)]'
              : 'bg-chat-ai border-primary/20 text-foreground'
          }`}
        >
          {/* Matrix-style header for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-xs text-primary">GYNO_AI_RESPONSE</span>
            </div>
          )}
          
          {message.isEmergency && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-destructive/10 rounded border border-destructive/30">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-bold text-destructive">EMERGENCY_PROTOCOL_ACTIVATED</span>
            </div>
          )}
          
          <div className={`leading-relaxed ${
            isUser ? 'text-primary' : 'text-foreground'
          }`}>
            {message.content}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-primary/10">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono ${
                isUser ? 'text-primary/70' : 'text-muted-foreground'
              }`}>
                [{message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}]
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
                className={`h-6 px-2 hover:shadow-glow transition-all ${
                  message.isEmergency 
                    ? 'text-destructive hover:text-destructive hover:bg-destructive/10' 
                    : 'text-primary/60 hover:text-primary hover:bg-primary/10'
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