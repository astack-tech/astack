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
  previousLabel?: string;
  nextLabel?: string;
}

/** Previous and next tiles at the end of a docs or example page. */
export default function PagerLinks({
  previous,
  next,
  label,
  previousLabel = 'Previous',
  nextLabel = 'Next',
}: PagerLinksProps) {
  return (
    <nav className="pager" aria-label={label}>
      {previous ? (
        <Link href={previous.href} className="tile pager-link">
          <span className="pager-dir">
            <ArrowLeftIcon size={14} aria-hidden="true" /> {previousLabel}
          </span>
          <span className="pager-title">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link href={next.href} className="tile pager-link pager-next">
          <span className="pager-dir">
            {nextLabel} <ArrowRightIcon size={14} aria-hidden="true" />
          </span>
          <span className="pager-title">{next.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
