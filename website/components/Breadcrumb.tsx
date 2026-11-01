import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Where the page sits in the site. The last item is the current page. */
export default function Breadcrumb({
  items,
  label = 'Breadcrumb',
}: {
  items: BreadcrumbItem[];
  /** Accessible name of the navigation landmark. */
  label?: string;
}) {
  return (
    <nav aria-label={label}>
      <ol className="breadcrumbs">
        {items.map((item, i) => (
          <li key={`${item.label}-${String(i)}`}>
            {item.href && i !== items.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
