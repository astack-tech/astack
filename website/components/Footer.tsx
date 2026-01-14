/**
 * Footer Component
 *
 * Site-wide footer with branding, navigation links, and copyright.
 */

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/10">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00F0FF]/5 rounded-full"
        style={{ filter: 'blur(100px)' }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold gradient-text mb-2">AStack</h2>
            <p className="text-gray-500">Everything is a Component</p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://github.com/astack-tech/astack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              GitHub
            </a>
            <Link href="/#features" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
              Features
            </Link>
            <Link
              href="/#quickstart"
              className="text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Quick Start
            </Link>
            <Link
              href="/#computation-model"
              className="text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Computation Model
            </Link>
            <Link
              href="/#use-cases"
              className="text-gray-400 hover:text-[#00F0FF] transition-colors"
            >
              Use Cases
            </Link>
            <Link href="/blog" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
              Blog
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/30" />
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AStack. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
