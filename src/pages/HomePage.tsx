import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/chat', { state: { initialQuery: searchQuery.trim() } });
    } else {
      navigate('/chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

        {/* Search bar */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=">>> ENTER_QUERY: periods, symptoms, PMDD, contraception..."
              className="w-full h-14 pl-6 pr-14 text-lg bg-input/50 border-primary/30 focus:ring-primary focus:border-primary font-mono placeholder:text-muted-foreground/60 shadow-glow backdrop-blur-sm"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-primary hover:shadow-neon transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/chat')}
            variant="outline"
            className="px-8 py-4 text-lg border-primary/50 hover:border-primary hover:shadow-glow transition-all duration-300 font-mono min-w-[200px]"
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