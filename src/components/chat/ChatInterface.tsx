import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Share2, Settings, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "./ChatMessage";
import { EmergencyAlert } from "./EmergencyAlert";
import { ShareModal } from "./ShareModal";
import { ApiKeyModal } from "./ApiKeyModal";
import { generateGynecologicalResponse } from "@/lib/gemini";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  credibilityScore?: number;
  isEmergency?: boolean;
}

export const ChatInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI gynecological health assistant powered by advanced medical AI. I provide evidence-based information about women's health, periods, symptoms, and wellness. All responses include credibility scores based on medical evidence. What would you like to know?",
      type: 'ai',
      timestamp: new Date(),
      credibilityScore: 95
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showShare, setShowShare] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_custom_api_key');
    if (savedApiKey) {
      setCustomApiKey(savedApiKey);
    }
  }, []);

  const detectEmergency = (text: string): boolean => {
    const emergencyKeywords = [
      'severe pain', 'heavy bleeding', 'can\'t stop bleeding', 'hemorrhage',
      'passed out', 'fainted', 'severe cramping', 'chest pain',
      'difficulty breathing', 'extreme pain', 'emergency', 'urgent',
      'severe nausea', 'fever above', 'high fever', 'infected'
    ];
    
    return emergencyKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const generateResponse = async (userMessage: string): Promise<{ content: string; credibilityScore: number; isEmergency: boolean }> => {
    setIsLoading(true);
    return await generateGynecologicalResponse(userMessage, customApiKey);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await generateResponse(input);
      
      if (response.isEmergency) {
        setShowEmergency(true);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        type: 'ai',
        timestamp: new Date(),
        credibilityScore: response.credibilityScore,
        isEmergency: response.isEmergency
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Sorry, I couldn't process your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const handleEmergencyCall = () => {
    window.open('https://www.google.com/search?q=gynecologist+near+me', '_blank');
    setShowEmergency(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-gradient-cyber opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      {/* Header */}
      <div className="relative border-b border-primary/20 bg-card/80 backdrop-blur-sm shadow-neon">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-neon"></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary font-mono tracking-wider">GYNO.APP</h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">/// AI_GYNECOLOGICAL_ASSISTANT</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="border-primary/30 hover:border-primary hover:shadow-glow">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">HOME</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowApiKey(true)} className="border-primary/30 hover:border-primary hover:shadow-glow">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">API</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowShare('general')} className="border-primary/30 hover:border-primary hover:shadow-glow">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">SHARE</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full"
      >
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onShare={() => setShowShare(message.id)}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-chat-ai border border-primary/20 rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[80%] shadow-neon">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-primary font-mono">PROCESSING_QUERY...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative border-t border-primary/20 bg-card/80 backdrop-blur-sm shadow-neon">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder=">>> ENTER_QUERY: symptoms, periods, health_data..."
                className="pr-12 min-h-[48px] sm:min-h-[52px] bg-input border-primary/30 focus:ring-primary focus:border-primary font-mono text-sm placeholder:text-muted-foreground/60 shadow-glow"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 sm:px-6 bg-gradient-primary hover:shadow-neon transition-all duration-300 font-mono text-xs sm:text-sm border border-primary/50"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">SEND</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-3 text-center font-mono">
            // DISCLAIMER: CONSULT_MEDICAL_PROFESSIONALS FOR CRITICAL_DECISIONS
          </p>
        </div>
      </div>

      {/* Emergency Alert Modal */}
      {showEmergency && (
        <EmergencyAlert
          onClose={() => setShowEmergency(false)}
          onCall={handleEmergencyCall}
        />
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          messageId={showShare}
          onClose={() => setShowShare(null)}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKey}
        onClose={() => setShowApiKey(false)}
        onSave={(key) => {
          setCustomApiKey(key);
          localStorage.setItem('gemini_custom_api_key', key);
          toast.success("Custom API key configured successfully!");
        }}
      />
    </div>
  );
};