/**
 * Markdown rendering shared by the blog, the docs and the examples.
 *
 * The output is static HTML. Client behavior (copy buttons, Mermaid diagrams) is attached by
 * `components/RichContent.tsx`, which looks for the markup produced here.
 */

import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const COPY_ICON =
  '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 256 256" fill="currentColor">' +
  '<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>' +
  '</svg>';

/** Converts heading text to a URL fragment. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function escapeAttribute(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Options for `renderMarkdown`. */
export interface RenderOptions {
  /** Add `id` attributes to `h2` and `h3` headings. Defaults to true. */
  headingIds?: boolean | undefined;
}

/**
 * Renders GitHub-flavored markdown to HTML with highlighted code, copyable code blocks,
 * scrollable tables and Mermaid placeholders.
 */
export async function renderMarkdown(
  markdown: string,
  options: RenderOptions = {}
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { plainText: ['mermaid'] })
    .use(rehypeStringify)
    .process(markdown);

  let html = String(file);

  // Mermaid blocks become figures. RichContent renders them on the client.
  html = html.replace(
    /<pre><code class="[^"]*language-mermaid[^"]*">([\s\S]*?)<\/code><\/pre>/g,
    (_match, source: string) => {
      const diagram = decodeEntities(source);
      return (
        `<figure class="mermaid-figure" data-diagram="${escapeAttribute(diagram)}">` +
        `<pre class="mermaid-source" tabindex="0" aria-label="Diagram source">${source}</pre>` +
        '</figure>'
      );
    }
  );

  // Every remaining code block gets a frame with a copy button.
  html = html.replace(
    /<pre>/g,
    '<div class="code-frame"><button type="button" class="copy-button code-copy" aria-label="Copy code" title="Copy code">' +
      `${COPY_ICON}</button><pre tabindex="0" aria-label="Code example">`
  );
  html = html.replace(/<\/pre>(?!<\/figure>)/g, '</pre></div>');

  html = html
    .replace(
      /<table>/g,
      '<div class="article-table" tabindex="0" role="region" aria-label="Data table"><table>'
    )
    .replace(/<\/table>/g, '</table></div>');

  if (options.headingIds !== false) {
    html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level: string, inner: string) => {
      const id = slugify(inner);
      return `<h${level} id="${id}"><a class="heading-anchor" href="#${id}">${inner}</a></h${level}>`;
    });
  }

  return html;
}
