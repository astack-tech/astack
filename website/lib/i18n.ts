import strings from '@/content/i18n.json';

/** Languages of the documentation. English is the source; others are translations. */
export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

/** The `lang` attribute and the `hreflang` code of each locale. */
export const LANGUAGE_TAG: Record<Locale, string> = { en: 'en', zh: 'zh-CN' };

export type Labels = (typeof strings)['en'];

/** Interface text of the docs pages. The strings live in content/i18n.json. */
export function labels(locale: Locale): Labels {
  return strings[locale];
}

/** URL of a docs page. English pages sit at /docs, translations under /<locale>/docs. */
export function docsPath(locale: Locale, slug: string): string {
  return locale === 'en' ? `/docs/${slug}` : `/${locale}/docs/${slug}`;
}

/** The other locale, for the language switch. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'zh' : 'en';
}
