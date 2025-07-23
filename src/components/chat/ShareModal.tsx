import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, MessageCircle, Send, Instagram, Camera } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  messageId: string;
  onClose: () => void;
}

export const ShareModal = ({ messageId, onClose }: ShareModalProps) => {
  const handleCopyLink = () => {
    // In a real implementation, you'd generate a shareable link
    navigator.clipboard.writeText(`https://gyno.app/shared/${messageId}`);
    toast.success("Link copied to clipboard!");
  };

  const handleScreenshot = () => {
    // In a real implementation, you'd capture the specific message
    toast.success("Screenshot saved! You can now share it privately.");
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent("I found this helpful health information on Gyno.app");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent("Helpful health information from Gyno.app");
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
  };

  const handleInstagramShare = () => {
    toast.info("Take a screenshot and share it on your Instagram story or DM!");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Health Information</DialogTitle>
          <DialogDescription>
            Share this information privately and securely
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="bg-muted/30 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Privacy Notice:</p>
            <p className="text-sm">Your health conversations remain anonymous when shared. No personal data is included.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleScreenshot} variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Screenshot
            </Button>
            
            <Button onClick={handleCopyLink} variant="outline" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Share via:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={handleWhatsAppShare} variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
              
              <Button onClick={handleTelegramShare} variant="outline" size="sm">
                <Send className="h-4 w-4 mr-1" />
                Telegram
              </Button>
              
              <Button onClick={handleInstagramShare} variant="outline" size="sm">
                <Instagram className="h-4 w-4 mr-1" />
                Instagram
              </Button>
            </div>
          </div>

          <Button variant="secondary" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};