'use client';

/**
 * UseCases Component
 *
 * Horizontal scrolling showcase of real-world applications.
 * Features:
 * - Horizontal scroll carousel
 * - Large visual cards with icons
 * - Smooth scroll behavior
 * - Navigation arrows
 *
 * Design: Horizontal carousel for engaging browsing experience
 */

import { useRef } from 'react';

export default function UseCases() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use case data
  const useCases = [
    {
      title: 'Agent with Tools',
      description: 'Create agents that use tools for real-world tasks',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: 'https://github.com/astack-tech/astack/tree/master/examples/agent-with-tools',
    },
    {
      title: 'Deep Research',
      description: 'Automated research pipelines with web search and analysis',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      link: 'https://github.com/astack-tech/astack/tree/master/examples/simple-deep-research',
    },
    {
      title: 'RAG Pipeline',
      description: 'Retrieval-augmented generation with vector stores',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: 'https://github.com/astack-tech/astack/tree/master/examples',
    },
    {
      title: 'Multi-Agent',
      description: 'Coordinate multiple agents for complex tasks',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: 'https://github.com/astack-tech/astack/tree/master/examples',
    },
    {
      title: 'Workflow Automation',
      description: 'Complex workflows with branching and parallel execution',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      link: 'https://github.com/astack-tech/astack/tree/master/examples',
    },
  ];

  // Scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="use-cases" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Use </span>
              <span className="gradient-text">Cases</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl">
              Explore real-world applications built with AStack
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {useCases.map((useCase, index) => (
            <a
              key={index}
              href={useCase.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-80 snap-start"
            >
              <div className="h-full glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00F0FF]/10 to-transparent pointer-events-none" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] mb-6 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all">
                  {useCase.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00F0FF] transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {useCase.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-[#00F0FF] transition-colors">
                  <span>View on GitHub</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}

          {/* View all card */}
          <a
            href="https://github.com/astack-tech/astack/tree/master/examples"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-80 snap-start"
          >
            <div className="h-full glass rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all duration-300 border-2 border-dashed border-white/10 hover:border-[#00F0FF]/30">
              <div className="w-14 h-14 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-400 group-hover:text-[#00F0FF] transition-colors">
                View All Examples
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
