/**
 * Root Layout Component
 *
 * Provides the base HTML structure and global styles for the AStack website.
 * Includes font configuration, metadata, and viewport settings.
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
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
  metadataBase: new URL('https://astack.tech'),
  title: {
    default: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    template: '%s | AStack',
  },
  description:
    'AStack is a composable AI agent framework built on HLang\'s monadic FBP paradigm. Create powerful AI agents with type-safe components, Observable streams, and declarative composition. Perfect for building autonomous agents, RAG applications, and complex AI workflows in TypeScript.',
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
    apple: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: 'https://astack.tech',
    siteName: 'AStack',
    title: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    description:
      'Build powerful AI agents with type-safe components, Observable streams, and monadic composition. The composable framework for autonomous agents and AI workflows.',
    images: [
      {
        url: '/logo.png',
        width: 240,
        height: 240,
        alt: 'AStack Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AStack - AI Agent Framework Built on Monadic Paradigm',
    description:
      'Build powerful AI agents with type-safe components and Observable streams.',
    images: ['/logo.png'],
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
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

        {children}
      </body>
    </html>
  );
}
