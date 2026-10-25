import Link from 'next/link';
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

interface BreadcrumbItem {
  label: string;
  href?: string;
}
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumbs">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {i > 0 && <CaretRightIcon size={12} aria-hidden="true" />}
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
