import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Camera, Share2, AlertTriangle, Phone } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { EmergencyAlert } from "./EmergencyAlert";
import { ShareModal } from "./ShareModal";
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your confidential gynecological health assistant. I provide evidence-based information about women's health, periods, symptoms, and wellness. What would you like to know?",
      type: 'ai',
      timestamp: new Date(),
      credibilityScore: 95
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showShare, setShowShare] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // Mock API call - in real implementation, this would call DeepSeek API
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    const isEmergency = detectEmergency(userMessage);
    
    if (isEmergency) {
      return {
        content: "⚠️ Based on your symptoms, this could require immediate medical attention. I strongly recommend contacting a healthcare provider right away. Here's what you should know while seeking care: [detailed medical guidance would appear here]",
        credibilityScore: 98,
        isEmergency: true
      };
    }

    // Mock responses based on common topics
    const responses = [
      {
        content: "Period irregularities can be caused by various factors including stress, weight changes, hormonal imbalances, or underlying conditions like PCOS. A normal cycle ranges from 21-35 days. If your cycle varies significantly from your norm or you experience other symptoms, consider tracking your cycles and consulting with a gynecologist.",
        credibilityScore: 92
      },
      {
        content: "Vaginal discharge varies throughout your menstrual cycle. Normal discharge is usually clear or white, odorless or with a mild scent. Watch for changes in color, consistency, or smell, especially if accompanied by itching, burning, or pain, as these could indicate an infection requiring medical attention.",
        credibilityScore: 89
      },
      {
        content: "Menstrual cramps are common but shouldn't be debilitating. Over-the-counter pain relievers, heat therapy, gentle exercise, and adequate hydration can help. If cramps severely impact your daily life, it could indicate conditions like endometriosis or fibroids - worth discussing with a healthcare provider.",
        credibilityScore: 94
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse.content,
      credibilityScore: randomResponse.credibilityScore,
      isEmergency: false
    };
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

  const handleScreenshot = () => {
    if (chatContainerRef.current) {
      // In a real implementation, you'd use html2canvas or similar
      toast.success("Screenshot feature coming soon!");
    }
  };

  const handleEmergencyCall = () => {
    window.open('https://www.google.com/search?q=gynecologist+near+me', '_blank');
    setShowEmergency(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Gyno.app</h1>
              <p className="text-sm text-muted-foreground">Confidential women's health guidance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleScreenshot}>
                <Camera className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowShare('general')}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full"
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
              <div className="bg-chat-ai rounded-2xl px-4 py-3 max-w-[80%] shadow-card">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about periods, symptoms, or women's health..."
                className="pr-12 min-h-[44px] bg-input border-border focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-gradient-primary hover:shadow-glow transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Always consult healthcare professionals for medical decisions. This is informational guidance only.
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
    </div>
  );
};