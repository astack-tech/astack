/**
 * Blog Navbar Component
 *
 * Simplified navigation bar for blog pages.
 * Only shows logo and link back to home.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BlogNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="navigation"
      aria-label="Blog navigation"
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        {/* Logo and brand */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Back to AStack Home">
          {/* Logo icon */}
          <div className="relative h-8 w-8 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo.svg"
              alt="AStack Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Brand name with gradient */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">AStack</span>

            {/* Beta badge with glow effect */}
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 glow-pulse">
              beta
            </span>
          </div>
        </Link>

        {/* Right side - Back to home link */}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#00F0FF] transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
    </nav>
  );
}
