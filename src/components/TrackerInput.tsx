import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";

interface TrackerInputProps {
  title: string;
  placeholder: string;
  onSubmit: (input: string) => Promise<void>;
  loading?: boolean;
}

export const TrackerInput = ({ title, placeholder, onSubmit, loading }: TrackerInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    
    await onSubmit(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Card className="border-primary/20 shadow-glow bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="min-h-[120px] resize-none border-primary/30 focus:border-primary bg-background/50"
          disabled={loading}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Press Cmd/Ctrl + Enter to submit
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="bg-gradient-primary hover:shadow-neon"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};