'use client';

/**
 * Hero Component
 *
 * Main landing section with centered layout and dynamic elements.
 * Features:
 * - Centered headline with gradient text
 * - Typewriter code animation
 * - Data flow canvas background
 * - Glass morphism CTA buttons
 *
 * Design: Bold, centered layout with maximum visual impact
 */

import ParticleCanvas from './ParticleCanvas';
import TypewriterCode from './TypewriterCode';
import CopyButton from './CopyButton';

export default function Hero() {
  // Code for typewriter effect - matches real AStack API with proper indentation
  const code = `import { Agent } from "@astack-tech/components";
import { Deepseek } from "@astack-tech/integrations";

const agent = new Agent({
  model: new Deepseek({ model: "deepseek-chat" }),
  tools: [searchTool, writeTool],
});

const result = await agent.run("Research AI trends");`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0A0A0A]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Central radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#00F0FF]/5 rounded-full"
          style={{ filter: 'blur(150px)' }}
        />

        {/* Data flow canvas animation */}
        <ParticleCanvas />

        {/* Center focus vignette - darkens center for better text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 600px 450px at center, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 70%)'
          }}
        />
      </div>

      {/* Main content - centered */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center py-20">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-glow mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">
            Built on Monadic Paradigm
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="gradient-text text-glow">AStack</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">
          The composable framework for{' '}
          <span className="text-[#00F0FF] font-medium">AI applications</span>
        </p>

        {/* Description */}
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Build any AI pattern with type-safe components, zero adaptation layers,
          and mathematical composition guarantees from HLang&apos;s monadic foundation.
        </p>

        {/* Typewriter code display */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="rounded-xl p-6 text-left relative" style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-gray-500 font-mono">example.ts</span>
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <TypewriterCode
                code={code}
                typingSpeed={25}
                loop={true}
                loopDelay={4000}
              />
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Primary CTA */}
          <a
            href="#quickstart"
            className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden transition-all duration-300 bg-[#00F0FF]/10 border border-[#00F0FF]/50 hover:bg-[#00F0FF]/20 hover:border-[#00F0FF] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
          >
            <span className="relative z-10 text-[#00F0FF] font-semibold group-hover:text-white transition-colors">
              Get Started
            </span>
          </a>

          {/* Secondary CTA */}
          <a
            href="https://github.com/astack-tech/astack"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-xl font-medium border border-white/20 hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/5 transition-all duration-300"
          >
            <span className="text-gray-300 group-hover:text-white transition-colors">
              View on GitHub
            </span>
          </a>
        </div>

        {/* Quick install */}
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg mb-16" style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <span className="text-gray-500 text-sm flex items-center">$</span>
          <code className="text-sm font-mono text-gray-300 flex items-center">
            npm install @astack-tech/core
          </code>
          <div className="flex items-center">
            <CopyButton text="npm install @astack-tech/core" size="sm" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-12 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-[#00F0FF] rounded-full animate-bounce" />
          </div>
          <span className="text-sm">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
