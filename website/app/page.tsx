/** Landing page for the AStack component framework. */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComputationModel from '@/components/ComputationModel';
import QuickStart from '@/components/QuickStart';
import Comparison from '@/components/Comparison';
import UseCases from '@/components/UseCases';
import { CORE_VERSION, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/site';

export default function Home() {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AStack',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    description: SITE_DESCRIPTION,
    url: 'https://astack.tech',
    downloadUrl: 'https://www.npmjs.com/package/@astack-tech/core',
    softwareVersion: CORE_VERSION,
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
    keywords: SITE_KEYWORDS.join(', '),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />
      <main id="main-content" className="home frame">
        <Hero />
        <ul className="board foundations" aria-label="Framework foundations">
          <li className="tile">Framework foundations</li>
          <li className="tile block hue-blue">TypeScript native</li>
          <li className="tile block hue-rose">Observable streams</li>
          <li className="tile block hue-mint">Flow-based programming</li>
          <li className="tile block hue-amber">MIT licensed</li>
        </ul>
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
