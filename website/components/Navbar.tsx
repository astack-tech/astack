/**
 * Navbar Component
 *
 * Fixed navigation bar with glass morphism effect.
 * Features:
 * - Transparent glass background with blur
 * - Logo with gradient text
 * - Navigation links with hover effects
 * - GitHub stars counter
 * - Mobile-responsive design with hamburger menu
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GitHubStars from './GitHubStars';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links configuration
  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#computation-model', label: 'Computation Model' },
    { href: '#quickstart', label: 'Quick Start' },
    { href: '#comparison', label: 'Comparison' },
    { href: '#use-cases', label: 'Use Cases' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        {/* Logo and brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="AStack Home"
        >
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

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
            >
              {link.label}
              {/* Hover underline effect */}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00F0FF] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* GitHub stars counter */}
          <GitHubStars />

          {/* GitHub link */}
          <a
            href="https://github.com/astack-tech/astack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#00F0FF] transition-colors duration-200"
            aria-label="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu slide-out */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 border-b border-white/5 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 py-2 border-b border-white/5 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
