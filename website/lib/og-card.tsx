import { ImageResponse } from 'next/og';

/** Open Graph image size used by every generated card. */
export const OG_SIZE = { width: 1200, height: 630 };

interface CardProps {
  /** Small uppercase label above the title, for example `DOCS` or `EXAMPLE 03 · BASICS`. */
  eyebrow: string;
  title: string;
  description: string;
}

/** The three paths of the AStack mark, in a 128 × 112 box. */
const MARK_PATHS = ['M48 16H62L30 96H16Z', 'M66 16H80L112 96H98Z', 'M46 68H82L88 82H40Z'];

function Mark({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={(size * 112) / 128} viewBox="0 0 128 112" style={{ opacity }}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#d4d4d8" />
          <stop offset="0.52" stopColor="#8a8a94" />
          <stop offset="0.7" stopColor="#e4e4e7" />
          <stop offset="1" stopColor="#71717a" />
        </linearGradient>
      </defs>
      {MARK_PATHS.map(path => (
        <path key={path} d={path} fill="url(#metal)" />
      ))}
    </svg>
  );
}

/**
 * Renders a social preview card in the site's black and silver style. It matches the
 * static `/brand/social-card.png` and adds the page title and summary.
 */
export function renderOgCard({ eyebrow, title, description }: CardProps): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px 56px',
          backgroundColor: '#09090b',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          color: '#fafafa',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', right: 80, top: 64, display: 'flex' }}>
          <Mark size={180} opacity={0.12} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Mark size={64} opacity={1} />
          <div style={{ fontSize: 44, letterSpacing: -1.5 }}>astack</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960 }}>
          <div style={{ fontSize: 20, letterSpacing: 3, color: '#a1a1aa' }}>{eyebrow}</div>
          <div style={{ fontSize: 72, letterSpacing: -2.5, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#a1a1aa' }}>{description}</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 18,
            letterSpacing: 2,
            color: '#a1a1aa',
          }}
        >
          <div>COMPONENTS → PORTS → PIPELINES</div>
          <div>astack.tech</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
