/** Landing page for the AStack component framework. */

import BetaNotification from '@/components/BetaNotification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComputationModel from '@/components/ComputationModel';
import QuickStart from '@/components/QuickStart';
import Comparison from '@/components/Comparison';
import UseCases from '@/components/UseCases';

export default function Home() {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AStack',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    description:
      'AStack connects TypeScript components through ports and Observable streams. Use HLang monadic composition to build AI agents and workflows.',
    url: 'https://astack.tech',
    downloadUrl: 'https://www.npmjs.com/package/@astack-tech/core',
    softwareVersion: 'v0.2.0-beta.1',
    programmingLanguage: 'TypeScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'AStack Team',
      url: 'https://github.com/astack-tech',
    },
    sameAs: [
      'https://github.com/astack-tech/astack',
      'https://www.npmjs.com/package/@astack-tech/core',
    ],
    keywords:
      'AI agent framework, autonomous agents, TypeScript AI, monadic programming, LLM framework, RAG framework, AI workflow, agent orchestration',
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />
      <main id="main-content" className="homepage">
        <BetaNotification />
        <Hero />
        <div className="foundation-strip shell">
          <span>Framework foundations</span>
          <span>TypeScript native</span>
          <span>Observable streams</span>
          <span>Monadic composition</span>
          <span>MIT licensed</span>
        </div>
        <Features />
        <ComputationModel />
        <QuickStart />
        <Comparison />
        <UseCases />
      </main>
      <Footer />
    </>
  );
}
