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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
      {/* Professional background */}
      <div className="absolute inset-0 bg-gradient-subtle"></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary tracking-wider mb-4">
            gyno
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Women's Health Guidance Platform
          </p>
          <p className="text-base text-muted-foreground opacity-80">
            Confidential AI-powered gynecological health consultation
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about periods, symptoms, contraception..."
              className="w-full h-14 pl-6 pr-14 text-lg bg-input border-border focus:ring-primary focus:border-primary rounded-full placeholder:text-muted-foreground/70"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 h-10 w-10 p-0 rounded-full hover:bg-primary/90 transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 text-lg rounded-full min-w-[200px] font-semibold"
          >
            Start Consultation
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="px-4 py-2 bg-muted rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
              Period Health
            </span>
            <span className="px-4 py-2 bg-muted rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
              Symptoms Analysis
            </span>
            <span className="px-4 py-2 bg-muted rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
              Wellness Guidance
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-muted-foreground space-y-2 max-w-lg text-center">
          <p>AI consultation is a supplement, not a replacement for professional medical care.</p>
          <p className="text-xs">For emergency symptoms, seek immediate medical attention.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;