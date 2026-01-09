/**
 * Home Page
 *
 * Main landing page for AStack website.
 * Assembles all section components in order:
 * 1. Beta notification banner
 * 2. Navigation bar
 * 3. Hero section with canvas animation
 * 4. Features overview
 * 5. Computation model explanation
 * 6. Quick start guide
 * 7. Technical comparison
 * 8. Use cases showcase
 * 9. Footer
 */

import BetaNotification from '@/components/BetaNotification';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComputationModel from '@/components/ComputationModel';
import QuickStart from '@/components/QuickStart';
import Comparison from '@/components/Comparison';
import UseCases from '@/components/UseCases';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Fixed navigation */}
      <Navbar />

      {/* Top notification banner - positioned below navbar */}
      <div className="pt-16">
        <BetaNotification />
      </div>

      {/* Hero section with particle animation */}
      <Hero />

      {/* Core features grid */}
      <Features />

      {/* Computation model explanation */}
      <ComputationModel />

      {/* Quick start guide */}
      <QuickStart />

      {/* Framework comparison */}
      <Comparison />

      {/* Use cases showcase */}
      <UseCases />

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5">
        {/* Background */}
        <div className="absolute inset-0 bg-black" />

        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00F0FF]/5 rounded-full blur-[100px]" />

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
              <a
                href="#features"
                className="text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Features
              </a>
              <a
                href="#quickstart"
                className="text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Quick Start
              </a>
              <a
                href="#computation-model"
                className="text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Computation Model
              </a>
              <a
                href="#use-cases"
                className="text-gray-400 hover:text-[#00F0FF] transition-colors"
              >
                Use Cases
              </a>
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
    </main>
  );
}
