import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Phone, Clock, MapPin } from "lucide-react";

interface EmergencyAlertProps {
  onClose: () => void;
  onCall: () => void;
}

export const EmergencyAlert = ({ onClose, onCall }: EmergencyAlertProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-destructive/20 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Emergency Symptoms Detected
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Based on your symptoms, this may require immediate medical attention.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h3 className="font-medium text-destructive mb-2">Immediate Actions:</h3>
            <ul className="text-sm space-y-1 text-foreground">
              <li>• If severe pain or heavy bleeding: Call emergency services</li>
              <li>• Contact your gynecologist or primary care doctor</li>
              <li>• Go to urgent care or emergency room if symptoms worsen</li>
              <li>• Have someone accompany you if feeling faint or unwell</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onCall}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Gynecologist
            </Button>
            
            <Button variant="outline" onClick={() => window.open('tel:911')}>
              <Phone className="h-4 w-4 mr-2" />
              Call 911
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Don't delay seeking professional medical care</span>
          </div>

          <Button variant="secondary" onClick={onClose} className="w-full">
            I understand, continue conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};