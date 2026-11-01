'use client';

import { useEffect, useRef } from 'react';
import type { Mermaid } from 'mermaid';

interface RichContentProps {
  /** HTML produced by `renderMarkdown`. */
  html: string;
  className?: string | undefined;
}

type MermaidApi = Mermaid;

let mermaidPromise: Promise<MermaidApi> | undefined;

function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import('mermaid').then(module => module.default);
  return mermaidPromise;
}

/**
 * Reads a CSS custom property. next/font defines the font variables on `<body>`, so
 * read from there; theme colors are inherited by it as well.
 */
function cssVar(name: string): string {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

let diagramCount = 0;

/** Mermaid renders through shared global state, so renders run one at a time. */
let renderQueue: Promise<void> = Promise.resolve();

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}

/** Below this width, left-to-right flowcharts are drawn top-down so labels stay readable. */
const NARROW_QUERY = '(max-width: 559px)';

function isNarrow(): boolean {
  return window.matchMedia(NARROW_QUERY).matches;
}

/**
 * Returns the diagram source to render. On narrow screens a horizontal flowchart is
 * turned vertical, which fits the viewport without shrinking the text.
 */
function sourceForViewport(source: string): string {
  return isNarrow() ? source.replace(/^(\s*(?:flowchart|graph))\s+(?:LR|RL)\b/u, '$1 TD') : source;
}

const DIAGRAM_PADDING = 12;
const MIN_DIAGRAM_WIDTH = 420;

/**
 * Sets the viewBox to the drawn content. Mermaid's own viewBox can be smaller than the
 * content when edge labels extend past the nodes, which clips the diagram.
 */
function fitToContent(svg: SVGSVGElement | null, narrow: boolean): void {
  if (svg === null) {
    return;
  }
  const box = svg.getBBox();
  if (box.width === 0 || box.height === 0) {
    return;
  }
  const width = box.width + DIAGRAM_PADDING * 2;
  const height = box.height + DIAGRAM_PADDING * 2;
  svg.setAttribute(
    'viewBox',
    `${String(box.x - DIAGRAM_PADDING)} ${String(box.y - DIAGRAM_PADDING)} ${String(width)} ${String(height)}`
  );
  svg.style.maxWidth = `${String(width)}px`;
  // On wide screens a diagram never shrinks below a readable width. Narrow screens get a
  // top-down layout instead, which can scale to the container without losing legibility.
  svg.style.minWidth = narrow ? '' : `${String(Math.min(width, MIN_DIAGRAM_WIDTH))}px`;
  svg.removeAttribute('height');
}

function scheduleDiagrams(container: HTMLElement): Promise<void> {
  renderQueue = renderQueue.then(() => renderDiagrams(container)).catch(() => undefined);
  return renderQueue;
}

/**
 * Diagrams change the page height after the browser has scrolled to the URL's #anchor.
 * Once they render, scroll to the anchor again, unless the reader has scrolled meanwhile.
 */
function keepAnchorInPlace(rendered: Promise<void>): () => void {
  const hash = window.location.hash;
  if (hash.length < 2) {
    return () => undefined;
  }
  let moved = false;
  const onInput = (): void => {
    moved = true;
  };
  const events: readonly ('wheel' | 'touchstart' | 'keydown' | 'pointerdown')[] = [
    'wheel',
    'touchstart',
    'keydown',
    'pointerdown',
  ];
  for (const name of events) {
    window.addEventListener(name, onInput, { once: true, passive: true });
  }
  void rendered.then(() => {
    if (!moved && window.location.hash === hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
    }
  });
  return () => {
    for (const name of events) {
      window.removeEventListener(name, onInput);
    }
  };
}

async function renderDiagrams(container: HTMLElement): Promise<void> {
  const theme = isDarkTheme() ? 'dark' : 'light';
  const variant = `${theme}:${isNarrow() ? 'narrow' : 'wide'}`;
  const figures = [...container.querySelectorAll<HTMLElement>('figure.mermaid-figure')].filter(
    figure => figure.dataset['renderedVariant'] !== variant
  );
  if (figures.length === 0) {
    return;
  }

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    // Mermaid 12 defaults to the ELK layout and the neo look. The site design uses the
    // dagre layout and the classic look, so both are set explicitly.
    layout: 'dagre',
    look: 'classic',
    fontFamily: cssVar('--font-geist-sans') || 'sans-serif',
    htmlLabels: false,
    flowchart: {
      curve: 'basis',
      padding: 14,
      // Mermaid 12 widens short labels to 120px and wraps long ones at 120px. Size each
      // node to its label instead, and wrap only labels longer than 200px.
      minNodeWidth: 0,
      wrappingWidth: 200,
    },
    themeVariables: {
      fontSize: '14px',
      background: cssVar('--tile'),
      primaryColor: cssVar('--tile-2'),
      primaryTextColor: cssVar('--ink'),
      primaryBorderColor: cssVar('--tile-3'),
      secondaryColor: cssVar('--tile-3'),
      tertiaryColor: cssVar('--tile'),
      lineColor: cssVar('--muted'),
      textColor: cssVar('--ink'),
      edgeLabelBackground: cssVar('--tile'),
      clusterBkg: cssVar('--tile-2'),
      clusterBorder: cssVar('--tile-3'),
    },
  });

  for (const figure of figures) {
    const source = figure.dataset['diagram'];
    if (source === undefined) {
      continue;
    }
    diagramCount += 1;
    try {
      const { svg } = await mermaid.render(
        `astack-diagram-${String(diagramCount)}`,
        sourceForViewport(source)
      );
      let canvas = figure.querySelector<HTMLDivElement>('.mermaid-canvas');
      if (canvas === null) {
        canvas = document.createElement('div');
        canvas.className = 'mermaid-canvas';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Diagram');
        figure.prepend(canvas);
      }
      canvas.innerHTML = svg;
      fitToContent(canvas.querySelector('svg'), variant.endsWith(':narrow'));
      figure.dataset['renderedVariant'] = variant;
      figure.classList.add('is-rendered');
    } catch {
      // Leave the source visible when a diagram cannot be rendered.
      figure.classList.remove('is-rendered');
    }
  }
}

async function copyCode(button: HTMLButtonElement): Promise<void> {
  const code = button.closest('.code-frame')?.querySelector('pre')?.textContent ?? '';
  let label = 'Copied';
  try {
    await navigator.clipboard.writeText(code.replace(/\n$/, ''));
    button.dataset['state'] = 'copied';
  } catch {
    label = 'Copy failed. Select the code to copy.';
    button.dataset['state'] = 'error';
  }
  button.setAttribute('aria-label', label);
  button.title = label;
  window.setTimeout(() => {
    delete button.dataset['state'];
    button.setAttribute('aria-label', 'Copy code');
    button.title = 'Copy code';
  }, 2200);
}

/**
 * Renders static markdown HTML and adds copy buttons and theme-aware Mermaid diagrams.
 */
export default function RichContent({ html, className }: RichContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (container === null) {
      return undefined;
    }

    const onClick = (event: MouseEvent): void => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>('button.code-copy');
      if (button) {
        void copyCode(button);
      }
    };
    container.addEventListener('click', onClick);

    const releaseAnchor = keepAnchorInPlace(scheduleDiagrams(container));
    const observer = new MutationObserver(() => {
      void scheduleDiagrams(container);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const narrowQuery = window.matchMedia(NARROW_QUERY);
    const onViewportChange = (): void => {
      void scheduleDiagrams(container);
    };
    narrowQuery.addEventListener('change', onViewportChange);

    return () => {
      container.removeEventListener('click', onClick);
      releaseAnchor();
      observer.disconnect();
      narrowQuery.removeEventListener('change', onViewportChange);
    };
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
