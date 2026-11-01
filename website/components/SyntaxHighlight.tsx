'use client';

import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('typescript', typescript);

interface SyntaxHighlightProps {
  code: string;
  className?: string | undefined;
}

/**
 * Highlights TypeScript with highlight.js. The token classes are the same ones the docs
 * and blog use, so every code sample on the site shares one color scheme.
 */
export default function SyntaxHighlight({ code, className = '' }: SyntaxHighlightProps) {
  const html = useMemo(() => hljs.highlight(code, { language: 'typescript' }).value, [code]);

  return (
    <pre className={className || undefined} tabIndex={0}>
      <code className="hljs language-typescript" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
