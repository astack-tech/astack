'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon, WarningCircleIcon } from '@phosphor-icons/react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function CopyButton({ text, className = '', size = 'md' }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    []
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus('idle'), 2500);
  }
  const label =
    status === 'copied'
      ? 'Copied'
      : status === 'error'
        ? 'Copy failed. Select the code to copy.'
        : 'Copy to clipboard';
  return (
    <button
      type="button"
      onClick={copy}
      className={`copy-button ${className}`}
      aria-label={label}
      title={label}
    >
      {status === 'copied' ? (
        <CheckIcon size={size === 'sm' ? 15 : 17} />
      ) : status === 'error' ? (
        <WarningCircleIcon size={17} />
      ) : (
        <CopyIcon size={size === 'sm' ? 15 : 17} />
      )}
      <span className="sr-only" role="status">
        {status === 'idle' ? '' : label}
      </span>
    </button>
  );
}
