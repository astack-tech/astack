import type { Metadata } from 'next';
import Image from 'next/image';
import { DownloadSimpleIcon, ArrowDownIcon } from '@phosphor-icons/react/dist/ssr';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Brand and identity',
  description:
    'The AStack identity: symbol construction, silver and monochrome variants, usage guidance, and downloadable brand assets.',
  alternates: { canonical: 'https://astack.tech/brand' },
};

const ASSETS = [
  ['Silver symbol', 'SVG · transparent', '/brand/logo.svg'],
  ['Ink symbol', 'SVG · light backgrounds', '/brand/logo-ink.svg'],
  ['White symbol', 'SVG · dark backgrounds', '/brand/logo-white.svg'],
  ['Organization avatar', 'PNG · 512 × 512', '/brand/avatar.png'],
  ['Repository banner', 'SVG · 1280 × 480', '/brand/readme-banner.svg'],
  ['Repository banner', 'PNG · 1280 × 480', '/brand/readme-banner.png'],
  ['Social preview', 'PNG · 1200 × 630', '/brand/social-card.png'],
  ['Construction drawing', 'SVG · 1400 × 850', '/brand/logo-construction.svg'],
];

const MEASURES: [label: string, value: string][] = [
  ['Artboard', '128 × 112'],
  ['Visible bounds', '96 × 80'],
  ['Apex gap', '4'],
  ['Crossbar height', '14'],
];

const VARIANTS = [
  {
    name: 'Silver',
    use: 'Primary identity · dark surfaces',
    sample: 'silver',
    src: '/brand/logo.svg',
    alt: 'Silver AStack logo on black',
  },
  {
    name: 'Ink',
    use: 'Light surfaces · print',
    sample: 'ink',
    src: '/brand/logo-ink.svg',
    alt: 'Ink AStack logo on white',
  },
  {
    name: 'White',
    use: 'Single-color reproduction',
    sample: 'white',
    src: '/brand/logo-white.svg',
    alt: 'White AStack logo on black',
  },
];

export default function BrandPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="frame brand-page">
        <header className="board brand-hero">
          <div className="tile brand-hero-text">
            <h1>
              Three parts.
              <br />
              One composition.
            </h1>
            <div className="brand-hero-foot">
              <p>
                Our symbol follows the structure of the framework: separate components, connected
                through a shared interface.
              </p>
              <a className="button" href="#brand-assets">
                Download brand assets <ArrowDownIcon size={16} />
              </a>
            </div>
          </div>
          <figure className="tile brand-stage">
            <Image
              src="/brand/logo.svg"
              alt="AStack silver symbol: two sloped members and a separate crossbar form an open A."
              width={256}
              height={224}
              priority
            />
            <figcaption>Silver symbol</figcaption>
          </figure>
        </header>

        <section className="section" aria-labelledby="brand-meaning">
          <div className="section-head">
            <h2 id="brand-meaning">The parts stay visible.</h2>
          </div>
          <div className="board">
            <div className="tile brand-principle block hue-silver">
              <h3>Compose</h3>
              <p>
                Two sloped members and one crossbar form an A. Each part keeps its own boundary,
                just as a component keeps its own contract.
              </p>
            </div>
            <div className="tile brand-principle block hue-blue">
              <h3>Connect</h3>
              <p>
                The crossbar represents the relationship between components. The gaps distinguish
                connection from a single, fused block.
              </p>
            </div>
            <div className="tile brand-principle block hue-rose">
              <h3>Extend</h3>
              <p>
                The apex remains open. It gives the mark a clear direction and represents a
                framework that accepts new components.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="brand-geometry">
          <div className="section-head">
            <h2 id="brand-geometry">One geometry. Every application.</h2>
            <p>
              The construction view uses the same three paths as the production logo. Its flat fill
              exposes the shape; the silver version adds a gradient without changing those paths.
            </p>
          </div>
          <div className="board">
            <figure className="tile brand-drawing">
              <Image
                src="/brand/construction-mark.svg"
                alt="Construction grid for the AStack symbol. Artboard 128 by 112 units; visible mark 96 by 80 units; apex gap 4 units; crossbar from y=68 to y=82."
                width={512}
                height={448}
              />
              <figcaption>Production paths with alignment guides</figcaption>
            </figure>
            <dl className="brand-measures">
              {MEASURES.map(([label, value]) => (
                <div key={label} className="tile">
                  <dt>{label}</dt>
                  <dd>
                    {value}
                    <span>units</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="brand-variants">
          <div className="section-head">
            <h2 id="brand-variants">Silver, ink, and white.</h2>
            <p>
              Use silver on dark surfaces. Use ink on light surfaces and white when a single solid
              color is needed. The symbol stays the same in every version.
            </p>
          </div>
          <div className="board">
            {VARIANTS.map(variant => (
              <figure key={variant.name} className="tile brand-variant">
                <div className={`brand-sample sample-${variant.sample}`}>
                  <Image src={variant.src} alt={variant.alt} width={128} height={112} />
                </div>
                <figcaption>
                  <strong>{variant.name}</strong>
                  <span>{variant.use}</span>
                </figcaption>
              </figure>
            ))}
            <div className="tile brand-rule">
              <h3>Give it space.</h3>
              <p>
                Leave at least 16 units of clear space around the visible mark. Use the symbol at 24
                pixels or larger. Use the supplied favicon at smaller sizes.
              </p>
            </div>
            <div className="tile brand-rule">
              <h3>Keep the construction.</h3>
              <p>
                Scale proportionally. Preserve the gaps and the gradient direction. Do not stretch,
                rotate, add outlines, or place the mark on a low-contrast background.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="brand-applications">
          <div className="section-head">
            <h2 id="brand-applications">A consistent first impression.</h2>
            <p>
              The repository banner and social preview pair the symbol with the framework’s central
              idea. The organization avatar uses the same silver symbol on black.
            </p>
          </div>
          <figure className="tile brand-banner">
            <Image
              src="/brand/readme-banner.png"
              alt="AStack repository banner: Everything is a component. The composable TypeScript framework for AI applications."
              width={1280}
              height={480}
            />
            <figcaption>Repository banner · 1280 × 480</figcaption>
          </figure>
        </section>

        <section id="brand-assets" className="section" aria-labelledby="brand-downloads">
          <div className="section-head">
            <h2 id="brand-downloads">Ready to use.</h2>
            <p>
              Download the production files below. SVG files retain their geometry at any size. PNG
              exports are provided for services that require raster images.
            </p>
          </div>
          <div className="board brand-downloads">
            {ASSETS.map(([name, detail, href]) => (
              <a className="tile" href={href} download key={href}>
                <span>
                  <strong>{name}</strong>
                  <small>{detail}</small>
                </span>
                <DownloadSimpleIcon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="brand-license">
            The repository license applies to these files. Using the identity does not imply project
            endorsement or affiliation.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
