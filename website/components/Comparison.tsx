/**
 * Comparison Component
 *
 * Visual comparison between AStack and other frameworks.
 * Features:
 * - Side-by-side card comparison
 * - Visual indicators for advantages
 * - Animated highlight effects
 * - Clean, scannable design
 *
 * Design: Dual-column cards with visual emphasis on AStack advantages
 */

export default function Comparison() {
  // Key differentiators
  const differentiators = [
    {
      title: 'Zero Adaptation Layer',
      astack: 'Direct integration',
      other: 'Multiple adapters',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Dual Run Modes',
      astack: 'run() + _transform()',
      other: 'Single mode',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: 'Type-Safe Ports',
      astack: 'Full type safety',
      other: 'Runtime checks',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Language',
      astack: 'TypeScript',
      other: 'Python',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="comparison" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Technical </span>
            <span className="gradient-text">Independence</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            100% original framework with independent architecture, inspired by{' '}
            <a
              href="https://haystack.deepset.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F0FF] hover:underline font-medium"
            >
              Haystack
            </a>
            &apos;s API style
          </p>
        </div>

        {/* Comparison cards */}
        <div className="w-full mx-auto overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-gray-500 text-sm font-medium">Feature</div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                  <span className="text-[#00F0FF] font-semibold">AStack</span>
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-500 font-medium">Others</span>
              </div>
            </div>

            {/* Comparison rows */}
            <div className="space-y-3">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl glass hover:bg-white/5 transition-all group"
                >
                  {/* Feature name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all">
                      {item.icon}
                    </div>
                    <span className="text-white font-medium text-sm md:text-base">{item.title}</span>
                  </div>

                  {/* AStack value */}
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-xs md:text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item.astack}
                    </span>
                  </div>

                  {/* Other value */}
                  <div className="text-center">
                    <span className="text-gray-500 text-xs md:text-sm">{item.other}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 relative">
            {/* Quote marks */}
            <span className="absolute top-4 left-6 text-4xl text-[#00F0FF]/20 font-serif">&quot;</span>
            <span className="absolute bottom-4 right-6 text-4xl text-[#00F0FF]/20 font-serif">&quot;</span>

            <p className="text-lg text-gray-300 leading-relaxed relative z-10">
              AStack provides developers with a more concise and flexible component-based AI framework
              through an independently innovative technical approach.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
