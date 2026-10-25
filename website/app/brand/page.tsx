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

const assets = [
  ['Silver symbol', 'SVG · transparent', '/brand/logo.svg'],
  ['Ink symbol', 'SVG · light backgrounds', '/brand/logo-ink.svg'],
  ['White symbol', 'SVG · dark backgrounds', '/brand/logo-white.svg'],
  ['Organization avatar', 'PNG · 512 × 512', '/brand/avatar.png'],
  ['Repository banner', 'SVG · 1280 × 480', '/brand/readme-banner.svg'],
  ['Repository banner', 'PNG · 1280 × 480', '/brand/readme-banner.png'],
  ['Social preview', 'PNG · 1200 × 630', '/brand/social-card.png'],
  ['Construction drawing', 'SVG · 1400 × 850', '/brand/logo-construction.svg'],
];

export default function BrandPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="brand-page shell">
        <header className="brand-hero">
          <div>
            <p className="eyebrow">ASTACK / BRAND & IDENTITY</p>
            <h1>
              Three parts.
              <br />
              One composition.
            </h1>
            <p>
              Our symbol follows the structure of the framework: separate components, connected
              through a shared interface.
            </p>
            <a className="text-link" href="#brand-assets">
              Download brand assets <ArrowDownIcon size={16} />
            </a>
          </div>
          <figure className="brand-stage brand-stage-silver">
            <Image
              src="/brand/logo.svg"
              alt="AStack silver symbol: two sloped members and a separate crossbar form an open A."
              width={256}
              height={224}
              priority
            />
            <figcaption>ASTACK / SILVER SYMBOL</figcaption>
          </figure>
        </header>

        <section className="brand-section" aria-labelledby="brand-meaning">
          <div className="brand-section-heading">
            <p className="eyebrow">01 / THE IDEA</p>
            <h2 id="brand-meaning">The parts stay visible.</h2>
          </div>
          <div className="brand-principles">
            <div>
              <span className="mono">01</span>
              <h3>Compose</h3>
              <p>
                Two sloped members and one crossbar form an A. Each part keeps its own boundary,
                just as a component keeps its own contract.
              </p>
            </div>
            <div>
              <span className="mono">02</span>
              <h3>Connect</h3>
              <p>
                The crossbar represents the relationship between components. The gaps distinguish
                connection from a single, fused block.
              </p>
            </div>
            <div>
              <span className="mono">03</span>
              <h3>Extend</h3>
              <p>
                The apex remains open. It gives the mark a clear direction and represents a
                framework that accepts new components.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-section brand-construction" aria-labelledby="brand-geometry">
          <div className="brand-section-heading">
            <p className="eyebrow">02 / CONSTRUCTION</p>
            <h2 id="brand-geometry">
              One geometry.
              <br />
              Every application.
            </h2>
            <p>
              The construction view uses the same three paths as the production logo. Its flat fill
              exposes the shape; the silver version adds a gradient without changing those paths.
            </p>
          </div>
          <figure className="brand-drawing">
            <Image
              src="/brand/construction-mark.svg"
              alt="Construction grid for the AStack symbol. Artboard 128 by 112 units; visible mark 96 by 80 units; apex gap 4 units; crossbar from y=68 to y=82."
              width={512}
              height={448}
            />
            <figcaption>Production paths with alignment guides</figcaption>
          </figure>
          <dl className="brand-measures">
            <div>
              <dt>Artboard</dt>
              <dd>
                128 × 112<span>units</span>
              </dd>
            </div>
            <div>
              <dt>Visible bounds</dt>
              <dd>
                96 × 80<span>units</span>
              </dd>
            </div>
            <div>
              <dt>Apex gap</dt>
              <dd>
                4<span>units</span>
              </dd>
            </div>
            <div>
              <dt>Crossbar height</dt>
              <dd>
                14<span>units</span>
              </dd>
            </div>
          </dl>
        </section>

        <section className="brand-section" aria-labelledby="brand-variants">
          <div className="brand-section-heading">
            <p className="eyebrow">03 / MATERIAL & CONTRAST</p>
            <h2 id="brand-variants">Silver, ink, and white.</h2>
            <p>
              Use silver on dark surfaces. Use ink on light surfaces and white when a single solid
              color is needed. The symbol stays the same in every version.
            </p>
          </div>
          <div className="brand-variants">
            <figure>
              <div className="brand-sample sample-silver">
                <Image
                  src="/brand/logo.svg"
                  alt="Silver AStack logo on black"
                  width={128}
                  height={112}
                />
              </div>
              <figcaption>
                <strong>Silver</strong>
                <span>Primary identity · dark surfaces</span>
              </figcaption>
            </figure>
            <figure>
              <div className="brand-sample sample-ink">
                <Image
                  src="/brand/logo-ink.svg"
                  alt="Ink AStack logo on white"
                  width={128}
                  height={112}
                />
              </div>
              <figcaption>
                <strong>Ink</strong>
                <span>Light surfaces · print</span>
              </figcaption>
            </figure>
            <figure>
              <div className="brand-sample sample-white">
                <Image
                  src="/brand/logo-white.svg"
                  alt="White AStack logo on black"
                  width={128}
                  height={112}
                />
              </div>
              <figcaption>
                <strong>White</strong>
                <span>Single-color reproduction</span>
              </figcaption>
            </figure>
          </div>
          <div className="brand-guidance">
            <div>
              <h3>Give it space.</h3>
              <p>
                Leave at least 16 units of clear space around the visible mark. Use the symbol at 24
                pixels or larger. Use the supplied favicon at smaller sizes.
              </p>
            </div>
            <div>
              <h3>Keep the construction.</h3>
              <p>
                Scale proportionally. Preserve the gaps and the gradient direction. Do not stretch,
                rotate, add outlines, or place the mark on a low-contrast background.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-section" aria-labelledby="brand-applications">
          <div className="brand-section-heading">
            <p className="eyebrow">04 / APPLICATIONS</p>
            <h2 id="brand-applications">A consistent first impression.</h2>
            <p>
              The repository banner and social preview pair the symbol with the framework’s central
              idea. The organization avatar uses the same silver symbol on black.
            </p>
          </div>
          <figure className="brand-banner">
            <Image
              src="/brand/readme-banner.png"
              alt="AStack repository banner: Everything is a component. The composable TypeScript framework for AI applications."
              width={1280}
              height={480}
            />
            <figcaption>Repository banner · 1280 × 480</figcaption>
          </figure>
        </section>

        <section id="brand-assets" className="brand-section" aria-labelledby="brand-downloads">
          <div className="brand-section-heading">
            <p className="eyebrow">05 / ASSET LIBRARY</p>
            <h2 id="brand-downloads">Ready to use.</h2>
            <p>
              Download the production files below. SVG files retain their geometry at any size. PNG
              exports are provided for services that require raster images.
            </p>
          </div>
          <div className="brand-downloads">
            {assets.map(([name, detail, href]) => (
              <a href={href} download key={href}>
                <span>
                  <strong>{name}</strong>
                  <small>{detail}</small>
                </span>
                <DownloadSimpleIcon size={20} />
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
