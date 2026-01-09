/**
 * Root Layout Component
 *
 * Provides the base HTML structure and global styles for the AStack website.
 * Includes font configuration, metadata, and viewport settings.
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Configure Geist Sans font for body text
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Configure Geist Mono font for code blocks
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// SEO metadata configuration
export const metadata: Metadata = {
  title: 'AStack - The Composable AI Framework',
  description:
    'AStack is a 100% original, composable AI framework with a pure functional programming approach. Build powerful agent workflows with type-safe components.',
  keywords: [
    'AI framework',
    'TypeScript',
    'agents',
    'LLM',
    'composable',
    'functional programming',
  ],
  authors: [{ name: 'AStack Team' }],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'AStack - The Composable AI Framework',
    description:
      'Build powerful AI applications with a pure functional programming approach.',
    type: 'website',
    url: 'https://astack.tech',
  },
};

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

/**
 * Root layout wrapper component
 * Applies global fonts and base styling to all pages
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
