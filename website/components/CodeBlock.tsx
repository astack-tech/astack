'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

export default function CodeBlock({ 
  code, 
  language = 'typescript', 
  showLineNumbers = true,
  fileName
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // Custom styles matching AStack website design
  const customStyle = {
    background: 'transparent',
    padding: '1rem',
    margin: 0,
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    width: 'auto',
    minWidth: '100%',
    whiteSpace: 'pre'
  };

  return (
    <div className="w-full rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 overflow-hidden shadow-lg shadow-black/20 group">
      {/* File name and control buttons */}
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700/50">
          <div className="text-gray-300 text-sm font-mono flex items-center gap-2">
            <svg 
              className="w-4 h-4 text-gray-400" 
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
            {fileName}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
      )}
      
      {/* Code content with horizontal scroll */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur pointer-events-none"></div>
        <div className="overflow-x-auto w-full" style={{ overflowX: 'auto', display: 'block' }}>
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
        
        {/* Copy button with tooltip */}
        <div className="absolute top-2 right-2 flex items-center">
          {copied && (
            <div className="mr-2 py-1 px-2 bg-teal-700/90 text-white text-xs rounded-md animate-fade-in-out">
              Copied!
            </div>
          )}
          <button 
            className={`p-1.5 rounded-md ${copied ? 'bg-teal-700/90 text-white border-teal-500/70' : 'bg-gray-800/80 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/80'} border opacity-0 group-hover:opacity-100 transition-all duration-200`}
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
