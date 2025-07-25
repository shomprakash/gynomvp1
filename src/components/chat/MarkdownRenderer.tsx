import React, { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Process markdown-like formatting
  const processContent = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    const lines = text.split('\n');
    
    let currentIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headers
      if (line.startsWith('### ')) {
        parts.push(
          <h3 key={currentIndex++} className="text-lg font-bold text-primary mb-3 mt-4 first:mt-0">
            {line.replace('### ', '')}
          </h3>
        );
      }
      else if (line.startsWith('## ')) {
        parts.push(
          <h2 key={currentIndex++} className="text-xl font-bold text-primary mb-3 mt-4 first:mt-0">
            {line.replace('## ', '')}
          </h2>
        );
      }
      else if (line.startsWith('# ')) {
        parts.push(
          <h1 key={currentIndex++} className="text-2xl font-bold text-primary mb-4 mt-4 first:mt-0">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // Bullet points
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().replace(/^[*-]\s/, '');
        parts.push(
          <div key={currentIndex++} className="flex items-start gap-3 mb-2">
            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>{processInlineFormatting(content)}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line.trim())) {
        const content = line.trim().replace(/^\d+\.\s/, '');
        const number = line.trim().match(/^(\d+)\./)?.[1] || '1';
        parts.push(
          <div key={currentIndex++} className="flex items-start gap-3 mb-2">
            <span className="text-primary font-mono text-sm font-bold min-w-[20px]">{number}.</span>
            <span>{processInlineFormatting(content)}</span>
          </div>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        parts.push(<div key={currentIndex++} className="h-2"></div>);
      }
      // Regular paragraphs
      else if (line.trim()) {
        parts.push(
          <p key={currentIndex++} className="mb-3 leading-relaxed">
            {processInlineFormatting(line)}
          </p>
        );
      }
    }
    
    return parts;
  };

  // Process inline formatting like **bold** and *italic*
  const processInlineFormatting = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    let currentText = text;
    let index = 0;

    // Bold text **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${index}__`;
      parts.push(
        <strong key={`bold-${index++}`} className="font-bold text-primary">
          {content}
        </strong>
      );
      return placeholder;
    });

    // Italic text *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${index}__`;
      parts.push(
        <em key={`italic-${index++}`} className="italic text-primary/90">
          {content}
        </em>
      );
      return placeholder;
    });

    // Important medical terms (words in CAPS)
    currentText = currentText.replace(/\b[A-Z]{2,}\b/g, (match) => {
      const placeholder = `__CAPS_${index}__`;
      parts.push(
        <span key={`caps-${index++}`} className="font-mono text-primary font-bold">
          {match}
        </span>
      );
      return placeholder;
    });

    // Split and reconstruct
    const textParts = currentText.split(/(__[A-Z]+_\d+__)/);
    const finalParts: ReactNode[] = [];
    
    textParts.forEach((part, i) => {
      if (part.startsWith('__') && part.endsWith('__')) {
        const foundPart = parts.find(p => 
          React.isValidElement(p) && p.key === part.replace(/^__[A-Z]+_(\d+)__$/, '$1')
        );
        if (foundPart) {
          finalParts.push(foundPart);
        }
      } else if (part) {
        finalParts.push(<span key={`text-${i}`}>{part}</span>);
      }
    });

    return finalParts.length > 0 ? finalParts : [<span key="fallback">{text}</span>];
  };

  return (
    <div className="prose prose-sm max-w-none text-foreground">
      {processContent(content)}
    </div>
  );
};