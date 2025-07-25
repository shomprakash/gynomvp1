import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-gradient-cyber opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-primary to-transparent"></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary font-mono tracking-wider mb-4 animate-glow">
            GYNO.APP
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-neon"></div>
            <p className="text-sm text-muted-foreground font-mono">/// SECURE_GYNECOLOGICAL_AI_SYSTEM</p>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-neon"></div>
          </div>
          <p className="text-lg text-muted-foreground font-mono opacity-80">
            Advanced AI-powered women's health consultation platform
          </p>
        </div>

        {/* Search button */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 text-lg bg-gradient-primary hover:shadow-neon transition-all duration-300 font-mono border border-primary/50 min-w-[200px]"
          >
            START_CONSULTATION
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground font-mono">
            <span className="px-3 py-1 border border-primary/30 rounded-full hover:border-primary transition-colors">
              PERIOD_HEALTH
            </span>
            <span className="px-3 py-1 border border-primary/30 rounded-full hover:border-primary transition-colors">
              SYMPTOMS_ANALYSIS
            </span>
            <span className="px-3 py-1 border border-primary/30 rounded-full hover:border-primary transition-colors">
              WELLNESS_GUIDANCE
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-muted-foreground/60 font-mono space-y-1">
          <p>// DISCLAIMER: AI_CONSULTATION_SUPPLEMENT_NOT_REPLACEMENT</p>
          <p>// EMERGENCY_SYMPTOMS: SEEK_IMMEDIATE_MEDICAL_ATTENTION</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-4 h-4 border-l-2 border-t-2 border-primary/30"></div>
      <div className="absolute top-10 right-10 w-4 h-4 border-r-2 border-t-2 border-primary/30"></div>
      <div className="absolute bottom-10 left-10 w-4 h-4 border-l-2 border-b-2 border-primary/30"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 border-r-2 border-b-2 border-primary/30"></div>
    </div>
  );
};

export default HomePage;