'use client';

/**
 * Features Component - Bento Grid Layout
 *
 * Showcases AStack's core features in an asymmetric bento grid.
 * Features:
 * - Large feature cards
 * - Small feature cards for secondary features
 * - Glass morphism with hover effects
 * - Responsive grid layout
 *
 * Design: Asymmetric bento grid for visual interest
 */

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F0FF]/3 rounded-full"
          style={{ filter: 'blur(200px)' }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Technical </span>
            <span className="gradient-text">Innovations</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Built on{' '}
            <a
              href="https://github.com/hlang-tech/hlang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F0FF] hover:underline"
            >
              HLang
            </a>
            &apos;s monadic foundation with mathematical composition guarantees
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-auto">
          {/* Large Card 1 - Everything is a Component (spans 2 cols) */}
          <div className="lg:col-span-2 lg:row-span-2 group">
            <div className="h-full glass rounded-2xl p-8 hover:bg-white/5 transition-all duration-500 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all">
                  <svg
                    className="w-6 h-6 text-[#00F0FF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      strokeWidth="1.5"
                      style={{
                        strokeDasharray: '60',
                        animation: 'dashFlow 3s linear infinite',
                      }}
                    />
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      strokeWidth="1.5"
                      style={{
                        strokeDasharray: '24',
                        animation: 'dashFlow 3s linear infinite',
                        animationDelay: '1.5s',
                      }}
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00F0FF] transition-colors">
                  Monadic Component System
                </h3>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Every component extends{' '}
                  <a
                    href="https://github.com/hlang-tech/hlang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0FF] hover:underline"
                  >
                    HLang
                  </a>
                  &apos;s TransformNode (Component in AStack), providing mathematical composition guarantees. Agents,
                  tools, and pipelines share the same base interface with type-safe ports.
                </p>

                {/* Visual diagram */}
                <div className="overflow-x-auto">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/30 min-w-max">
                    <div className="flex-1 text-center">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-[#00F0FF]/20 border border-[#00F0FF]/30 flex items-center justify-center mb-2">
                        <span className="text-[#00F0FF] text-xs font-mono">In</span>
                      </div>
                      <span className="text-xs text-gray-500">Input Port</span>
                    </div>
                    <svg
                      className="w-8 h-8 text-[#00F0FF]/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <div className="flex-1 text-center">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/50 flex items-center justify-center mb-2">
                        <span className="text-[#00F0FF] text-sm font-bold">C</span>
                      </div>
                      <span className="text-xs text-gray-500">Component</span>
                    </div>
                    <svg
                      className="w-8 h-8 text-[#00F0FF]/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <div className="flex-1 text-center">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-[#00F0FF]/20 border border-[#00F0FF]/30 flex items-center justify-center mb-2">
                        <span className="text-[#00F0FF] text-xs font-mono">Out</span>
                      </div>
                      <span className="text-xs text-gray-500">Output Port</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small Card - Data Flow Paradigm */}
          <div className="group">
            <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                <svg
                  className="w-5 h-5 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    style={{
                      animation: 'electricPulse 1.5s ease-in-out infinite',
                    }}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Data Flow Paradigm
              </h3>
              <p className="text-sm text-gray-400">
                Flow-Based Programming treating LLMs as stateless generators, not control flow components
              </p>
            </div>
          </div>

          {/* Small Card - Dual Run Modes */}
          <div className="group">
            <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                <svg
                  className="w-5 h-5 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Dual Execution Modes
              </h3>
              <p className="text-sm text-gray-400">
                Independent execution with run() or reactive pipeline mode with _transform()
              </p>
            </div>
          </div>

          {/* Medium Card - Type-Safe Ports (spans 2 cols) */}
          <div className="lg:col-span-2 group">
            <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                  <svg
                    className="w-5 h-5 text-[#00F0FF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                    Type-Safe Port System
                  </h3>
                  <p className="text-sm text-gray-400">
                    Port.I() and Port.O() provide compile-time type checking and runtime validation
                    for component connections
                  </p>
                </div>
              </div>

              {/* Type visualization */}
              <div className="mt-4 overflow-x-auto">
                <div className="flex items-center gap-2 text-xs font-mono min-w-max md:ml-14">
                  <span className="px-2 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF]">string</span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF]">
                    Component
                  </span>
                  <span className="text-gray-600">→</span>
                  <span className="px-2 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF]">
                    Result&lt;T&gt;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Small Card - Modular Design */}
          <div className="group">
            <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                <svg
                  className="w-5 h-5 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    style={{
                      strokeDasharray: '60',
                      animation: 'dashFlow 3s linear infinite',
                    }}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Modular Design
              </h3>
              <p className="text-sm text-gray-400">
                Core, components, and integrations as separate packages
              </p>
            </div>
          </div>

          {/* Small Card - External Integration */}
          <div className="group">
            <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                <svg
                  className="w-5 h-5 text-[#00F0FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                Easy Integration
              </h3>
              <p className="text-sm text-gray-400">
                OpenAI-compatible interfaces for any model provider
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
