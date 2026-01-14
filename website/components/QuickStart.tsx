'use client';

/**
 * QuickStart Component
 *
 * Simplified getting started guide with tab-based package manager selection.
 * Features:
 * - Tab switching for npm/yarn/pnpm
 * - Minimal code examples
 * - Copy to clipboard functionality
 * - Clean, focused design with elegant step badges
 * - Hover glow effects on cards
 *
 * Design: Streamlined 3-step guide with visual emphasis
 */

import { useState } from 'react';
import CopyButton from './CopyButton';
import SyntaxHighlight from './SyntaxHighlight';

export default function QuickStart() {
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn' | 'pnpm'>('npm');

  // Install commands for different package managers
  const installCommands = {
    npm: 'npm install @astack-tech/core @astack-tech/components',
    yarn: 'yarn add @astack-tech/core @astack-tech/components',
    pnpm: 'pnpm add @astack-tech/core @astack-tech/components',
  };

  // Simple example code - matches real AStack API
  const exampleCode = `import { Agent } from "@astack-tech/components";
import { Deepseek } from "@astack-tech/integrations";

const agent = new Agent({
  model: new Deepseek({ model: "deepseek-chat" }),
  tools: [searchTool, writeTool],
});

const result = await agent.run("Research AI trends");`;

  return (
    <section id="quickstart" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full"
          style={{ filter: 'blur(200px)' }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Quick </span>
            <span className="gradient-text">Start</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get up and running with AStack in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="w-full mx-auto space-y-8">
          {/* Step 1: Install */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:border-[#00F0FF]/30">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              {/* Step badge and title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                    <span className="text-base font-bold text-[#00F0FF]">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-[#00F0FF] transition-colors">Install AStack</h3>
              </div>

              {/* Package manager tabs */}
              <div className="flex gap-2 mb-4">
                {(['npm', 'yarn', 'pnpm'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      packageManager === pm
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              {/* Install command */}
              <div className="rounded-xl bg-black/50 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-gray-500 font-mono">terminal</span>
                  <CopyButton text={installCommands[packageManager]} size="sm" />
                </div>
                <div className="p-4 font-mono text-sm">
                  <span className="text-gray-500">$ </span>
                  <span className="text-[#00F0FF]">{packageManager}</span>
                  <span className="text-gray-300"> {packageManager === 'npm' ? 'install' : 'add'} </span>
                  <span className="text-yellow-300">@astack-tech/core</span>
                  <span className="text-gray-300"> </span>
                  <span className="text-yellow-300">@astack-tech/components</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Create Agent */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:border-[#00F0FF]/30">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              {/* Step badge and title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                    <span className="text-base font-bold text-[#00F0FF]">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-[#00F0FF] transition-colors">Create Your First Agent</h3>
              </div>

              {/* Code example */}
              <div className="rounded-xl bg-black/50 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-gray-500 font-mono">agent.ts</span>
                  <CopyButton text={exampleCode} size="sm" />
                </div>
                <div className="p-4">
                  <SyntaxHighlight code={exampleCode} />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Run */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:border-[#00F0FF]/30">
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-transparent" />
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F0FF]/10 rounded-full"
                style={{ filter: 'blur(100px)' }}
              />
            </div>

            <div className="relative z-10">
              {/* Step badge and title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                    <span className="text-base font-bold text-[#00F0FF]">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-[#00F0FF] transition-colors">Run & Explore</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Your agent is ready! Explore more examples and documentation on GitHub.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/astack-tech/astack/tree/master/examples"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/50 text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                  <span>View Examples</span>
                </a>
                <a
                  href="https://github.com/astack-tech/astack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  <span>Read Documentation</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
