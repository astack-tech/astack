'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

import { isRecord } from '@/lib/json';

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
    <a
      className="github-stars"
      href="https://github.com/astack-tech/astack/stargazers"
      aria-label={`${String(stars)} stars on GitHub`}
    >
      <StarIcon size={12} />
      {stars.toLocaleString('en-US')}
    </a>
  );
}
