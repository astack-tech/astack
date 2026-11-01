import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

interface PagerTarget {
  href: string;
  title: string;
}

interface PagerLinksProps {
  previous?: PagerTarget | undefined;
  next?: PagerTarget | undefined;
  label: string;
}

/** Previous and next links at the end of a docs or example page. */
export default function PagerLinks({ previous, next, label }: PagerLinksProps) {
  return (
    <nav className="pager-links" aria-label={label}>
      {previous ? (
        <Link href={previous.href} className="pager-link">
          <span>
            <ArrowLeftIcon size={14} /> Previous
          </span>
          <b>{previous.title}</b>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="pager-link pager-next">
          <span>
            Next <ArrowRightIcon size={14} />
          </span>
          <b>{next.title}</b>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
