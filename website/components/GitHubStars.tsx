'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github-stars', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const data = await response.json();
        if (typeof data.stars === 'number' && Number.isFinite(data.stars)) setStars(data.stars);
      })
      .catch(() => {
        /* Keep the GitHub link available if the count is unavailable. */
      });
    return () => controller.abort();
  }, []);
  return stars === null ? null : (
    <a
      className="github-stars"
      href="https://github.com/astack-tech/astack/stargazers"
      aria-label={`${stars} stars on GitHub`}
    >
      <StarIcon size={12} />
      {stars.toLocaleString('en-US')}
    </a>
  );
}
