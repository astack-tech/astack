'use client';

/**
 * CopyButton Component
 *
 * A button that copies text to clipboard with visual feedback.
 * Features:
 * - Animated icon transition (copy → check)
 * - Tooltip feedback on success
 * - Accessible with aria labels
 * - Customizable styling
 */

import { useState, useCallback } from 'react';

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

export default function CopyButton({ text, className = '', size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [text]);

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonPadding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={handleCopy}
      className={`relative ${buttonPadding} rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-[#00F0FF] ${className}`}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {/* Copy icon */}
      <svg
        className={`${iconSize} transition-all duration-200 ${copied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>

      {/* Check icon (shown after copy) */}
      <svg
        className={`${iconSize} absolute inset-0 m-auto transition-all duration-200 text-green-400 ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>

      {/* Tooltip */}
      <span
        className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white whitespace-nowrap transition-all duration-200 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
      >
        Copied!
      </span>
    </button>
  );
}
