import { Fragment } from 'react';

/**
 * Renders plain text in which `backticked` spans become inline code.
 */
export default function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/u).map((part, index) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code key={index}>{part.slice(1, -1)}</code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

/** Removes inline-code backticks, for plain-text contexts such as meta descriptions. */
export function plainText(text: string): string {
  return text.replace(/`([^`]+)`/gu, '$1');
}
