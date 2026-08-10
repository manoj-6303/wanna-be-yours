import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathText({ text, className = '' }) {
  if (!text) return null;

  const parseMath = (inputStr) => {
    if (typeof inputStr !== 'string') return inputStr;

    // Regex to split by $$...$$ or $...$
    const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;
    const parts = inputStr.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <span
              key={index}
              className="my-2 block text-center overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return (
            <span
              key={index}
              className="inline-block px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      }

      return <span key={index}>{part}</span>;
    });
  };

  return <span className={`math-text ${className}`}>{parseMath(text)}</span>;
}
