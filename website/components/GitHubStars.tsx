'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

import { isRecord } from '@/lib/json';

/** The star count, shown inside the GitHub link once the API answers. */
export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github-stars', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          return;
        }
        const data: unknown = await response.json();
        const value = isRecord(data) ? data['stars'] : undefined;
        if (typeof value === 'number' && Number.isFinite(value)) {
          setStars(value);
        }
      })
      .catch(() => {
        /* Keep the GitHub link available if the count is unavailable. */
      });
    return () => {
      controller.abort();
    };
  }, []);
  return stars === null ? null : (
    <span className="github-stars" aria-label={`${String(stars)} stars`}>
      <StarIcon size={12} aria-hidden="true" />
      {stars.toLocaleString('en-US')}
    </span>
  );
}
