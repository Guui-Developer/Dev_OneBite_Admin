import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownBoxProps {
  content: string;
  className?: string;
}

export default function MarkdownBox({ content, className = '' }: MarkdownBoxProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  margin: '1rem 0',
                  backgroundColor: '#1A1A1A',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-[#2D2D2D] text-[#00D9FF] px-1.5 py-0.5 rounded text-sm font-medium`} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-[#E0E0E0]">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-[#D0D0D0]">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-[#D0D0D0]">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-[#D0D0D0]">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="ml-4 text-[#D0D0D0]">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#00D9FF] pl-4 italic my-4 text-[#B0B0B0] bg-[#00D9FF]/5 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-[#00D9FF] hover:text-[#00B8E6] underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-bold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-[#E0E0E0] italic">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
