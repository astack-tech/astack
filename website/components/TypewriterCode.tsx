'use client';

/**
 * TypewriterCode Component
 *
 * Animated code display with typewriter effect and real syntax highlighting.
 * Features:
 * - Character-by-character typing animation
 * - Real TypeScript syntax highlighting
 * - Proper indentation preserved
 * - Blinking cursor
 * - Loop or single-play modes
 */

import { useState, useEffect, useCallback } from 'react';

interface TypewriterCodeProps {
  /** Code string to display */
  code: string;
  /** Typing speed in milliseconds per character */
  typingSpeed?: number;
  /** Whether to loop the animation */
  loop?: boolean;
  /** Delay before restarting loop */
  loopDelay?: number;
}

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'type' | 'method' | 'number' | 'operator' | 'punctuation' | 'plain';

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
        // Check if it's a method call
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
    if (/[+\-*/%=<>!&|^~?:.]/.test(char)) {
      const op = char;
      i++;
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    // Punctuation
    if (/[{}[\](),;]/.test(char)) {
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
  method: 'text-blue-400',
  number: 'text-orange-400',
  operator: 'text-gray-400',
  punctuation: 'text-gray-400',
  plain: 'text-gray-300',
};

export default function TypewriterCode({
  code,
  typingSpeed = 25,
  loop = true,
  loopDelay = 4000,
}: TypewriterCodeProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Tokenize the code once
  const tokens = tokenize(code);

  // Calculate total characters
  const totalChars = tokens.reduce((sum, token) => sum + token.value.length, 0);

  const resetAnimation = useCallback(() => {
    setDisplayedChars(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedChars >= totalChars) {
      setIsTyping(false);
      if (loop) {
        const timeout = setTimeout(resetAnimation, loopDelay);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedChars((prev) => prev + 1);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedChars, totalChars, typingSpeed, loop, loopDelay, isTyping, resetAnimation]);

  // Render tokens with partial display
  let charCount = 0;
  const renderedTokens = tokens.map((token, tokenIndex) => {
    const tokenStart = charCount;
    const tokenEnd = charCount + token.value.length;
    charCount = tokenEnd;

    // Determine how much of this token to display
    let displayText = '';
    let showCursor = false;

    if (displayedChars >= tokenEnd) {
      // Fully display this token
      displayText = token.value;
    } else if (displayedChars > tokenStart) {
      // Partially display this token
      displayText = token.value.slice(0, displayedChars - tokenStart);
      showCursor = true;
    } else {
      // Don't display this token yet
      return null;
    }

    return (
      <span key={tokenIndex} className={TOKEN_COLORS[token.type]}>
        {displayText}
        {showCursor && (
          <span className="inline-block w-2 h-4 bg-[#00F0FF] ml-0.5 animate-pulse" />
        )}
      </span>
    );
  });

  return (
    <pre className="font-mono text-sm leading-relaxed">
      <code>{renderedTokens}</code>
    </pre>
  );
}
