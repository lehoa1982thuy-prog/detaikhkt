import React, { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options?: object) => void;
  }
}

interface MathRendererProps {
  text: string;
  className?: string;
}

const applyInlineMarkdown = (line: string) => {
  return line
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
    .replace(/`(.*?)`/g, '<code>$1</code>');      // Inline Code
};

const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';

  const blocks = markdown.split(/\n\s*\n/); // Split by one or more empty lines
  let html = '';

  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.split('\n');
    
    // Check for lists
    const isUl = lines.every(line => /^\s*[-*] /.test(line));
    const isOl = lines.every(line => /^\s*\d+\. /.test(line));

    if (isUl) {
      html += '<ul>';
      for (const line of lines) {
        const content = line.replace(/^\s*[-*] /, '');
        html += `<li>${applyInlineMarkdown(content)}</li>`;
      }
      html += '</ul>';
    } else if (isOl) {
      html += '<ol>';
      for (const line of lines) {
        const content = line.replace(/^\s*\d+\. /, '');
        html += `<li>${applyInlineMarkdown(content)}</li>`;
      }
      html += '</ol>';
    } else {
      // Handle headings and paragraphs
      if (lines[0].startsWith('# ')) {
        html += `<h1>${applyInlineMarkdown(lines[0].substring(2))}</h1>`;
      } else if (lines[0].startsWith('## ')) {
        html += `<h2>${applyInlineMarkdown(lines[0].substring(3))}</h2>`;
      } else if (lines[0].startsWith('### ')) {
        html += `<h3>${applyInlineMarkdown(lines[0].substring(4))}</h3>`;
      } else {
        // It's a paragraph
        html += `<p>${lines.map(applyInlineMarkdown).join('<br/>')}</p>`;
      }
    }
  }

  return html;
};

const MathRenderer: React.FC<MathRendererProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const processedHtml = useMemo(() => markdownToHtml(text), [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
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
  }, [processedHtml]);

  return <div 
          ref={containerRef} 
          className={className} 
          dangerouslySetInnerHTML={{ __html: processedHtml }} 
         />;
};

export default MathRenderer;