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
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from '@/lib/site';

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
    default: SITE_TITLE,
    template: '%s | AStack',
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
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
      { url: '/favicon.ico?v=silver-20261025', sizes: '16x16 32x32 48x48' },
      { url: '/favicon-32.png?v=silver-20261025', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.svg?v=silver-20261025', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon.ico?v=silver-20261025',
    apple: [
      { url: '/apple-touch-icon.png?v=silver-20261025', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    url: 'https://astack.tech',
    siteName: 'AStack',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
