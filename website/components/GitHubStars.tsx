'use client';

import { useState, useEffect } from 'react';

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch('https://api.github.com/repos/astack-tech/astack');
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStars();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <a
      href="https://github.com/astack-tech/astack"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-1 bg-gray-800/80 rounded-full px-2.5 py-1 text-xs hover:bg-gray-700/80 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-400"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span>{stars !== null ? stars : '—'}</span>
    </a>
  );
}
