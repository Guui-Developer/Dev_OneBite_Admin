import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBoxProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBox({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  className = '',
}: CodeBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[#2D2D2D] ${className}`}>
      {/* Header */}
      {title && (
        <div className="bg-[#1A1A1A] text-[#E0E0E0] px-4 py-0.5 text-sm font-medium flex items-center justify-between border-b border-[#2D2D2D]">
          <span>{title}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-[#2D2D2D] rounded transition-colors"
            title="코드 복사"
          >
            {copied ? (
              <Check size={16} className="text-[#00D9FF]" />
            ) : (
              <Copy size={16} className="text-[#B0B0B0]" />
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <div className="relative">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 p-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] rounded transition-colors"
            title="코드 복사"
          >
            {copied ? (
              <Check size={16} className="text-[#00D9FF]" />
            ) : (
              <Copy size={16} className="text-[#B0B0B0]" />
            )}
          </button>
        )}

        <SyntaxHighlighter
          language={language?.toLowerCase()}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
            fontSize: '0.875rem',
            padding: '1rem',
            backgroundColor: '#0D1117',
          }}
          codeTagProps={{
            style: {
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, Monaco, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
