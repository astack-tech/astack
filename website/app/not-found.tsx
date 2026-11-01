import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="frame">
        <div className="board not-found">
          <div className="tile not-found-text">
            <p className="not-found-code">404</p>
            <h1>This path ends here.</h1>
            <p>The page may have moved, or the address may be incorrect.</p>
            <Link href="/" className="button">
              <ArrowLeftIcon size={16} />
              Back to AStack
            </Link>
          </div>
          <div className="tile not-found-gap block hue-rose" aria-hidden="true" />
        </div>
      </main>
      <Footer />
    </>
  );
}
