'use client';

/**
 * CodeBlock Component
 *
 * Syntax-highlighted code display with:
 * - Glass morphism container
 * - Copy to clipboard functionality
 * - File name header with window controls
 * - Line numbers support
 * - Horizontal scroll for long lines
 *
 * Design: Dark glass container with cyan accent highlights
 */

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  /** The code string to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Optional file name to display in header */
  fileName?: string;
}

export default function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = true,
  fileName,
}: CodeBlockProps) {
  // Track copy state for visual feedback
  const [copied, setCopied] = React.useState(false);

  /**
   * Copy code to clipboard and show feedback
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // Custom styles for syntax highlighter
  const customStyle: React.CSSProperties = {
    background: 'transparent',
    padding: '1rem',
    margin: 0,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    width: 'auto',
    minWidth: '100%',
    whiteSpace: 'pre',
  };

  return (
    <div className="w-full rounded-xl glass overflow-hidden group">
      {/* File header with window controls */}
      {fileName && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          {/* File name with icon */}
          <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{fileName}</span>
          </div>

          {/* Window control dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
        </div>
      )}

      {/* Code content area */}
      <div className="relative">
        {/* Horizontal scroll container */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={customStyle}
            showLineNumbers={showLineNumbers}
            wrapLongLines={false}
          >
            {code.trim()}
          </SyntaxHighlighter>
        </div>

        {/* Copy button */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Copied feedback */}
          {copied && (
            <span className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded animate-fade-in">
              Copied!
            </span>
          )}

          {/* Copy button */}
          <button
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100'
            }`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy code'}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              // Checkmark icon
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              // Copy icon
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
