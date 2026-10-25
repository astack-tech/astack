/**
 * Root Layout Component
 *
 * Provides the base HTML structure and global styles for the AStack website.
 * Includes font configuration, metadata, and viewport settings.
 */

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

// Configure Geist Sans font for body text
const geistSans = localFont({
  src: './fonts/Geist-Latin.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

// Configure Geist Mono font for code blocks
const geistMono = localFont({
  src: './fonts/GeistMono-Latin.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

// SEO metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://astack.tech'),
  title: {
    default: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    template: '%s | AStack',
  },
  description:
    'AStack is a TypeScript framework for AI agents, RAG applications, and workflows. It connects components through typed ports, Observable streams, and HLang monadic composition.',
  keywords: [
    // Primary keywords
    'AI agent framework',
    'AI agent',
    'agent framework',
    'autonomous agents',
    // Technology keywords
    'TypeScript AI framework',
    'monadic programming',
    'functional programming AI',
    'composable AI',
    // Feature keywords
    'LLM framework',
    'RAG framework',
    'AI workflow',
    'AI pipeline',
    'tool calling',
    'agent orchestration',
    // Comparison keywords
    'LangChain alternative',
    'Haystack alternative',
    'AI framework TypeScript',
    // Use case keywords
    'build AI agents',
    'AI application development',
    'conversational AI',
    'AI automation',
  ],
  authors: [{ name: 'AStack Team', url: 'https://github.com/astack-tech' }],
  creator: 'AStack Team',
  publisher: 'AStack',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml', sizes: '48x48' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: 'https://astack.tech',
    siteName: 'AStack',
    title: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    description:
      'Build AI agents and workflows in TypeScript. Connect components through ports, Observable streams, and monadic composition.',
    images: [
      {
        url: '/brand/social-card.png',
        width: 1200,
        height: 630,
        alt: 'AStack: Everything is a component.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    description: 'Build AI agents in TypeScript with components, ports, and Observable streams.',
    images: ['/brand/social-card.png'],
    creator: '@astack_tech',
  },
  alternates: {
    canonical: 'https://astack.tech',
  },
  category: 'technology',
};

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HT3R09V416"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HT3R09V416');
          `}
        </Script>

        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
