'use client';

/**
 * SyntaxHighlight Component
 *
 * Simple TypeScript/JavaScript syntax highlighting without external dependencies.
 * Highlights:
 * - Keywords (import, from, const, await, new, etc.)
 * - Strings (single/double quotes, template literals)
 * - Comments
 * - Types and classes
 * - Properties and methods
 */

import { useMemo } from 'react';

interface SyntaxHighlightProps {
  code: string;
  className?: string;
}

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'type' | 'property' | 'method' | 'number' | 'operator' | 'punctuation' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// Keywords to highlight
const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var',
  'function', 'async', 'await', 'return', 'if', 'else', 'for',
  'while', 'class', 'extends', 'new', 'this', 'typeof', 'instanceof',
  'true', 'false', 'null', 'undefined', 'try', 'catch', 'throw',
]);

// Type-like words (PascalCase)
const isTypeLike = (word: string) => /^[A-Z][a-zA-Z0-9]*$/.test(word);

// Tokenize the code
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const char = code[i];
    const remaining = code.slice(i);

    // Whitespace - preserve exactly
    if (/\s/.test(char)) {
      let whitespace = '';
      while (i < code.length && /\s/.test(code[i])) {
        whitespace += code[i];
        i++;
      }
      tokens.push({ type: 'plain', value: whitespace });
      continue;
    }

    // Single-line comment
    if (remaining.startsWith('//')) {
      const end = code.indexOf('\n', i);
      const comment = end === -1 ? remaining : code.slice(i, end);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }

    // Multi-line comment
    if (remaining.startsWith('/*')) {
      const end = code.indexOf('*/', i + 2);
      const comment = end === -1 ? remaining : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value: comment });
      i += comment.length;
      continue;
    }

    // String (double quote)
    if (char === '"') {
      let str = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (i < code.length) {
        str += '"';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // String (single quote)
    if (char === "'") {
      let str = "'";
      i++;
      while (i < code.length && code[i] !== "'") {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (i < code.length) {
        str += "'";
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // Template literal
    if (char === '`') {
      let str = '`';
      i++;
      while (i < code.length && code[i] !== '`') {
        str += code[i];
        i++;
      }
      if (i < code.length) {
        str += '`';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // Number
    if (/[0-9]/.test(char)) {
      let num = '';
      while (i < code.length && /[0-9.]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Word (identifier, keyword, type)
    if (/[a-zA-Z_$]/.test(char)) {
      let word = '';
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        word += code[i];
        i++;
      }

      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (isTypeLike(word)) {
        tokens.push({ type: 'type', value: word });
      } else {
        // Check if it's a method call (followed by '(')
        const nextNonSpace = code.slice(i).match(/^\s*\(/);
        if (nextNonSpace) {
          tokens.push({ type: 'method', value: word });
        } else {
          tokens.push({ type: 'plain', value: word });
        }
      }
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(char)) {
      let op = char;
      i++;
      // Handle multi-char operators
      while (i < code.length && /[+\-*/%=<>!&|^~?:]/.test(code[i])) {
        op += code[i];
        i++;
      }
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    // Punctuation
    if (/[{}[\](),;.]/.test(char)) {
      tokens.push({ type: 'punctuation', value: char });
      i++;
      continue;
    }

    // Default: plain text
    tokens.push({ type: 'plain', value: char });
    i++;
  }

  return tokens;
}

// Color mapping for token types
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: 'text-purple-400',
  string: 'text-green-400',
  comment: 'text-gray-500',
  type: 'text-yellow-300',
  property: 'text-blue-300',
  method: 'text-blue-400',
  number: 'text-orange-400',
  operator: 'text-gray-400',
  punctuation: 'text-gray-400',
  plain: 'text-gray-300',
};

export default function SyntaxHighlight({ code, className = '' }: SyntaxHighlightProps) {
  const tokens = useMemo(() => tokenize(code), [code]);

  return (
    <pre className={`font-mono text-sm leading-relaxed overflow-x-auto ${className}`}>
      <code>
        {tokens.map((token, index) => (
          <span key={index} className={TOKEN_COLORS[token.type]}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
