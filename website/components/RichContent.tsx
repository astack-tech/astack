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

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

let diagramCount = 0;

/** Mermaid renders through shared global state, so renders run one at a time. */
let renderQueue: Promise<void> = Promise.resolve();

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}

const DIAGRAM_PADDING = 12;
const MIN_DIAGRAM_WIDTH = 420;

/**
 * Sets the viewBox to the drawn content. Mermaid's own viewBox can be smaller than the
 * content when edge labels extend past the nodes, which clips the diagram.
 */
function fitToContent(svg: SVGSVGElement | null): void {
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
  // Wide diagrams scroll on small screens instead of shrinking below a readable size.
  svg.style.minWidth = `${String(Math.min(width, MIN_DIAGRAM_WIDTH))}px`;
  svg.removeAttribute('height');
}

function scheduleDiagrams(container: HTMLElement): void {
  renderQueue = renderQueue.then(() => renderDiagrams(container)).catch(() => undefined);
}

async function renderDiagrams(container: HTMLElement): Promise<void> {
  const theme = isDarkTheme() ? 'dark' : 'light';
  const figures = [...container.querySelectorAll<HTMLElement>('figure.mermaid-figure')].filter(
    figure => figure.dataset['renderedTheme'] !== theme
  );
  if (figures.length === 0) {
    return;
  }

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: cssVar('--font-geist-sans') || 'sans-serif',
    htmlLabels: false,
    flowchart: { curve: 'basis', padding: 14 },
    themeVariables: {
      fontSize: '14px',
      background: cssVar('--color-bg-primary'),
      primaryColor: cssVar('--color-bg-secondary'),
      primaryTextColor: cssVar('--color-text-primary'),
      primaryBorderColor: cssVar('--strong-line'),
      secondaryColor: cssVar('--color-bg-tertiary'),
      tertiaryColor: cssVar('--color-bg-primary'),
      lineColor: cssVar('--silver-edge'),
      textColor: cssVar('--color-text-primary'),
      edgeLabelBackground: cssVar('--color-bg-primary'),
      clusterBkg: cssVar('--color-bg-secondary'),
      clusterBorder: cssVar('--line'),
    },
  });

  for (const figure of figures) {
    const source = figure.dataset['diagram'];
    if (source === undefined) {
      continue;
    }
    diagramCount += 1;
    try {
      const { svg } = await mermaid.render(`astack-diagram-${String(diagramCount)}`, source);
      let canvas = figure.querySelector<HTMLDivElement>('.mermaid-canvas');
      if (canvas === null) {
        canvas = document.createElement('div');
        canvas.className = 'mermaid-canvas';
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Diagram');
        figure.prepend(canvas);
      }
      canvas.innerHTML = svg;
      fitToContent(canvas.querySelector('svg'));
      figure.dataset['renderedTheme'] = theme;
      figure.classList.add('is-rendered');
    } catch {
      // Leave the source visible when a diagram cannot be rendered.
      figure.classList.remove('is-rendered');
    }
  }
}

async function copyCode(button: HTMLButtonElement): Promise<void> {
  const code = button.parentElement?.querySelector('pre')?.textContent ?? '';
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

    scheduleDiagrams(container);
    const observer = new MutationObserver(() => {
      scheduleDiagrams(container);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      container.removeEventListener('click', onClick);
      observer.disconnect();
    };
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
