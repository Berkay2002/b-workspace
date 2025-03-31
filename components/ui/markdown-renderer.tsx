import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-renderer whitespace-pre-wrap break-words">
      <ReactMarkdown
        components={{
          p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({children}) => <ul className="mb-3 list-disc pl-5">{children}</ul>,
          ol: ({children}) => <ol className="mb-3 list-decimal pl-5">{children}</ol>,
          li: ({children}) => <li className="mb-1">{children}</li>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-4">{children}</h2>,
          h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3">{children}</h3>,
          h4: ({children}) => <h4 className="text-sm font-bold mb-1 mt-3">{children}</h4>,
          hr: () => <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />,
          a: ({href, children}) => (
            <a 
              href={href} 
              className="text-blue-500 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({children}) => (
            <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 my-3 italic">
              {children}
            </blockquote>
          ),
          code: ({className, children}) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto my-3">
                <code className="text-sm">{children}</code>
              </pre>
            ) : (
              <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                {children}
              </code>
            );
          },
          table: ({children}) => (
            <div className="overflow-x-auto my-3">
              <table className="border-collapse w-full">
                {children}
              </table>
            </div>
          ),
          thead: ({children}) => <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>,
          tbody: ({children}) => <tbody>{children}</tbody>,
          tr: ({children}) => <tr>{children}</tr>,
          th: ({children}) => (
            <th className="px-4 py-2 text-left text-sm font-medium border border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
          strong: ({children}) => <strong className="font-bold">{children}</strong>,
          em: ({children}) => <em className="italic">{children}</em>,
          img: ({src, alt}) => (
            <img 
              src={src || ''} 
              alt={alt || ''} 
              className="max-w-full h-auto my-3 rounded-md"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 