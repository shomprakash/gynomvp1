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
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-normal text-foreground tracking-[-0.042em] mb-4" style={{ fontFamily: 'PT Serif, serif' }}>
            gyno
          </h1>
          <p className="text-xl text-muted-foreground mb-6" style={{ fontSize: 'var(--font-size-text-l)', lineHeight: 'var(--line-height-text-l)' }}>
            Complete women's health platform
          </p>
          <p className="text-base text-muted-foreground opacity-80" style={{ fontSize: 'var(--font-size-text)', lineHeight: 'var(--line-height-text)' }}>
            Confidential AI-powered gynecological health consultation with evidence-based information
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about periods, symptoms, contraception, pregnancy..."
              className="w-full h-14 pl-6 pr-14 bg-input border border-border focus:ring-2 focus:ring-primary focus:border-primary rounded-full placeholder:text-muted-foreground/70 shadow-sm transition-all duration-200"
              style={{ 
                fontSize: 'var(--font-size-input)', 
                lineHeight: 'var(--line-height-input)',
                boxShadow: '0 2px 20px rgba(41, 55, 84, 0.06)'
              }}
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 rounded-full min-w-[200px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-sm"
            style={{ 
              fontSize: 'var(--font-size-button-l)', 
              lineHeight: 'var(--line-height-button-l)',
              padding: '11px 30px'
            }}
          >
            Start Your Health Assessment
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-secondary rounded-full text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-sm font-medium" style={{ fontSize: 'var(--font-size-text-s)' }}>
              Period Health
            </span>
            <span className="px-4 py-2 bg-secondary rounded-full text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-sm font-medium" style={{ fontSize: 'var(--font-size-text-s)' }}>
              Symptoms Analysis
            </span>
            <span className="px-4 py-2 bg-secondary rounded-full text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer text-sm font-medium" style={{ fontSize: 'var(--font-size-text-s)' }}>
              Wellness Guidance
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 space-y-2 max-w-2xl text-center">
          <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-text-s)', lineHeight: 'var(--line-height-text-s)' }}>
            AI consultation is a supplement, not a replacement for professional medical care.
          </p>
          <p className="text-muted-foreground/80" style={{ fontSize: 'var(--font-size-text-xs)', lineHeight: 'var(--line-height-text-xs)' }}>
            For emergency symptoms, seek immediate medical attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;