import { redirect } from 'next/navigation';

/** `/zh/docs` opens the first Chinese page. */
export default function ChineseDocsIndex(): never {
  redirect('/zh/docs/introduction');
}
