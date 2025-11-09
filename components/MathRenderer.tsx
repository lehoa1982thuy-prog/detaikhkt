
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options?: object) => void;
  }
}

interface MathRendererProps {
  text: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.textContent = text;
      const timer = setTimeout(() => {
        try {
          if (window.renderMathInElement) {
            window.renderMathInElement(container, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
              ],
              throwOnError: false
            });
          }
        } catch (error) {
          console.error("KaTeX rendering error:", error);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return <div ref={containerRef} className={className} />;
};

export default MathRenderer;