import { redirect } from 'next/navigation';

/** `/docs` opens the first page. */
export default function DocsIndex(): never {
  redirect('/docs/introduction');
}
