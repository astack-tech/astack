import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="shell error-page">
        <p className="eyebrow">404 / PAGE NOT FOUND</p>
        <h1>This path ends here.</h1>
        <p>The page may have moved, or the address may be incorrect.</p>
        <Link href="/" className="button-primary">
          <ArrowLeftIcon size={16} />
          Back to AStack
        </Link>
      </main>
      <Footer />
    </>
  );
}
