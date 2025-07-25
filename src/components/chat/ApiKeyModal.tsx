import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Key, Shield } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onSave }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_custom_api_key', apiKey.trim());
      onSave(apiKey.trim());
    } else {
      localStorage.removeItem('gemini_custom_api_key');
      onSave('');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20 shadow-neon">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-mono">
            <Key className="h-5 w-5" />
            API_KEY_CONFIGURATION
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-sm">
            // Optional: Use custom Google Gemini API key (default key provided)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-primary font-mono">
              SECURE: Custom key stored locally only. Default key active if empty.
            </span>
          </div>
          
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy... (optional - leave empty for default)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10 font-mono text-sm bg-input border-primary/30 focus:border-primary"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-primary hover:shadow-neon"
            >
              {apiKey.trim() ? 'SET_CUSTOM' : 'USE_DEFAULT'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};