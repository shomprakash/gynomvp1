import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText = ({ text, speed = 20, onComplete }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
      )}
    </div>
  );
};