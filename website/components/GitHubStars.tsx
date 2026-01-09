'use client';

/**
 * GitHubStars Component
 *
 * Displays the current GitHub star count for the AStack repository.
 * Features:
 * - Fetches star count from internal API route (server-side)
 * - Glass morphism pill design
 * - Loading state handling
 * - Graceful error fallback
 *
 * Design: Compact pill with star icon and count
 */

import { useState, useEffect } from 'react';

export default function GitHubStars() {
  // State for star count and loading status
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch star count from internal API route
     * This avoids exposing GitHub token in frontend
     */
    async function fetchStars() {
      try {
        const response = await fetch('/api/github-stars');
        if (response.ok) {
          const data = await response.json();
          setStars(data.stars);
        } else {
          console.error('API error:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStars();
  }, []);

  // Don't render while loading
  if (loading) {
    return null;
  }

  // Don't render if failed to fetch stars (graceful degradation)
  if (stars === null) {
    return null;
  }

  return (
    <a
      href="https://github.com/astack-tech/astack"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-all duration-200 text-sm"
      aria-label={`${stars} stars on GitHub`}
    >
      {/* Star icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#00F0FF]"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      {/* Star count */}
      <span className="text-gray-300">{stars.toLocaleString()}</span>
    </a>
  );
}
