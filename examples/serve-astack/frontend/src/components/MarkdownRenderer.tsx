/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    if (typeof children === 'string') {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const language = className?.replace('language-', '') || 'text';

  // 检查是否为纯文本代码块（无语法高亮）
  const isPlainText = !className || className === 'language-text' || language === 'text';

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Language label and copy button */}
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 text-xs">
        <span className="text-neutral-400 font-medium">{language}</span>
        {isHovered && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code content */}
      <pre className="!mt-0 !mb-0 overflow-x-auto bg-neutral-900 px-4 py-4 text-sm">
        <code
          className={className}
          style={isPlainText ? { color: '#e6edf3' } : undefined}
          {...props}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

function InlineCode({ children, ...props }: InlineCodeProps) {
  return (
    <code
      className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm font-mono text-neutral-800"
      {...props}
    >
      {children}
    </code>
  );
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-neutral-900 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-strong:font-semibold prose-ul:text-neutral-700 prose-ol:text-neutral-700 prose-blockquote:border-l-neutral-300 prose-blockquote:text-neutral-600 prose-hr:border-neutral-200 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: (props: any) => {
            const { inline, className, children, ...rest } = props;
            if (inline) {
              return (
                <InlineCode className={className} {...rest}>
                  {children}
                </InlineCode>
              );
            }
            return (
              <CodeBlock className={className} {...rest}>
                {children}
              </CodeBlock>
            );
          },
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="bg-neutral-50 px-4 py-2 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-2 text-sm text-neutral-700 border-b border-neutral-200"
              {...props}
            >
              {children}
            </td>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4"
              {...props}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
