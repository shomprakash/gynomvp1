import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  // Health suggestion pool
  const healthSuggestions = [
    "Period Health", "Symptoms Analysis", "Wellness Guidance",
    "Fertility Planning", "Birth Control", "Hormone Balance",
    "Menstrual Cycle", "Pregnancy Care", "Sexual Health",
    "PCOS Support", "Endometriosis Info", "Contraception Guide",
    "Reproductive Health", "Gynecological Checkup", "Breast Health",
    "UTI Prevention", "Vaginal Health", "Menopause Support"
  ];

  // Randomize suggestions
  useEffect(() => {
    const getRandomSuggestions = () => {
      const shuffled = [...healthSuggestions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };
    setCurrentSuggestions(getRandomSuggestions());
    
    // Update suggestions every 10 seconds
    const interval = setInterval(() => {
      setCurrentSuggestions(getRandomSuggestions());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/chat', { state: { initialQuery: searchQuery.trim(), autoStart: true } });
    } else {
      navigate('/chat');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    navigate('/chat', { state: { initialQuery: suggestion, autoStart: true } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute inset-0 bg-gradient-subtle"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-health-mint rounded-full opacity-60 blur-sm"></div>
      <div className="absolute top-40 right-16 w-16 h-16 bg-health-lavender rounded-full opacity-50 blur-sm"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-health-peach rounded-full opacity-40 blur-sm"></div>
      <div className="absolute bottom-20 right-10 w-18 h-18 bg-health-sky rounded-full opacity-50 blur-sm"></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="font-futura text-7xl sm:text-8xl md:text-9xl font-medium text-primary mb-6 tracking-tight">
            gyno
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Advanced AI-assisted women's health platform
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-10 w-full max-w-2xl mx-auto">
          <div className="relative group">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about periods, symptoms, contraception, or any health concern..."
              className="w-full h-16 pl-6 pr-16 text-lg bg-input/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl shadow-input transition-all duration-300 placeholder:text-muted-foreground/60"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 h-12 w-12 p-0 rounded-lg bg-primary hover:bg-primary-glow shadow-button transition-all duration-300 hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-6">
          <Button
            onClick={() => navigate('/chat')}
            className="px-10 py-4 text-lg rounded-xl min-w-[220px] font-semibold bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-105"
          >
            Start Consultation
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3">
            {currentSuggestions.map((suggestion, index) => (
              <Button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outline"
                className={`px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft ${
                  index === 0 ? 'border-health-mint bg-health-mint/30 hover:bg-health-mint/50' :
                  index === 1 ? 'border-health-lavender bg-health-lavender/30 hover:bg-health-lavender/50' :
                  'border-health-peach bg-health-peach/30 hover:bg-health-peach/50'
                }`}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-sm text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            AI consultation is a supplement, not a replacement for professional medical care. For emergency symptoms, seek immediate medical attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;