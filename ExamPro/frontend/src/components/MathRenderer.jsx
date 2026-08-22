import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MathRenderer = React.memo(function MathRenderer({ text }) {
  if (!text) return null;
  
  let textStr = typeof text === 'string' ? text : String(text);
  
  if (typeof text === 'object' && text.text) {
    textStr = text.text;
  }
  
  // Basic math check for unescaped inline math
  if (!textStr.includes('$') && !textStr.includes('\\[') && !textStr.includes('\\(')) {
    const isMathy = textStr.includes('\\frac') || textStr.includes('\\sqrt') || textStr.includes('^{') || textStr.includes('_{') || textStr.includes('\\alpha') || textStr.includes('\\beta');
    const isShortOrNoSpaces = !textStr.includes(' ') || textStr.length < 60;
    
    if (isMathy && isShortOrNoSpaces) {
      if (/[a-zA-Z0-9]/.test(textStr)) {
        textStr = `$${textStr}$`;
      }
    }
  }

  // Handle literal newlines and standardise math blocks
  let cleanText = textStr.replace(/\\+n(?![a-z])/g, '\n').replace(/\\\\/g, '\n');

  cleanText = cleanText.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g).map((part, index) => {
    if (index % 2 === 1) {
      // Normalize to $ and $$ for remark-math
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        return `$${part.slice(2, -2)}$`;
      } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
        return `$$${part.slice(2, -2)}$$`;
      }
      return part;
    } else {
      // Text block: Convert pseudo-chemical formulas like CH3 to inline math
      let textPart = part.replace(/([a-zA-Z])(\d+)(?![a-zA-Z0-9])/g, '$\\text{$1}_{$2}$');
      // Add gaps between sentences for readability by converting sentence endings to paragraphs
      textPart = textPart.replace(/\. ([A-Z])/g, '.\n\n$1');
      return textPart;
    }
  }).join('');

  return (
    <div className="math-renderer-container w-full text-lg leading-relaxed py-1 break-words whitespace-normal">
      <ReactMarkdown 
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold" {...props} />,
          td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-2" {...props} />,
          // For lists
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />
        }}
      >
        {cleanText}
      </ReactMarkdown>
    </div>
  );
});

export default MathRenderer;
