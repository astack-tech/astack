import { ImageResponse } from 'next/og';

/** Open Graph image size used by every generated card. */
export const OG_SIZE = { width: 1200, height: 630 };

interface CardProps {
  /** Short label next to the wordmark, for example `Docs` or `Example 03 · Basics`. */
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

/** Block tints of the site's dark theme, mixed over the tile color. */
const BLOCKS = ['#2f3f5c', '#5a3a3f', '#2e4a40', '#575038', '#3a3a40', '#2c4a52'];

/**
 * Renders a social preview card in the site's board style: tiles on black, the
 * page title in its own tile, and a row of component blocks.
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
          gap: 8,
          padding: 24,
          backgroundColor: '#09090b',
          color: '#f4f4f5',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '40px 44px',
              backgroundColor: '#131316',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Mark size={52} opacity={1} />
              <div style={{ fontSize: 38, letterSpacing: -1.5 }}>astack</div>
              <div style={{ fontSize: 22, color: '#94949e', marginLeft: 12 }}>{eyebrow}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontSize: 68, letterSpacing: -2.6, lineHeight: 1.02 }}>{title}</div>
              <div style={{ fontSize: 27, lineHeight: 1.4, color: '#c6c6ce' }}>{description}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, height: 64 }}>
          {BLOCKS.map(color => (
            <div key={color} style={{ flex: 1, backgroundColor: color }} />
          ))}
          <div
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              backgroundColor: '#f4f4f5',
              color: '#09090b',
              fontSize: 22,
            }}
          >
            astack.tech
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
