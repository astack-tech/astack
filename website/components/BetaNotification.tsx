'use client';

/**
 * BetaNotification Component
 *
 * Announcement banner for beta releases.
 * Features:
 * - Fetches latest release info from GitHub API
 * - Glass morphism design with accent glow
 * - Install command display
 * - Link to release notes
 *
 * Design: Subtle banner with cyan accent
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Release {
  tag_name: string;
  html_url: string;
  name: string;
  prerelease: boolean;
  published_at: string;
}

export default function BetaNotification() {
  // State for release data
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch latest release information from internal API route
     * This avoids exposing GitHub token in frontend
     */
    async function fetchReleaseInfo() {
      try {
        const response = await fetch('/api/github-release');

        if (response.ok) {
          const data = await response.json();
          if (data.tag_name) {
            setRelease({
              tag_name: data.tag_name,
              html_url: data.html_url,
              name: data.name,
              prerelease: data.tag_name.includes('beta') || data.tag_name.includes('alpha'),
              published_at: data.published_at,
            });
          }
        } else {
          console.error('Failed to fetch release info:', response.status);
        }
      } catch (err) {
        console.error('Failed to fetch release info:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReleaseInfo();
  }, []);

  // Use default values if loading or error
  const version = release?.tag_name || 'v0.1.1-beta.0';
  const releaseUrl =
    release?.html_url ||
    'https://github.com/astack-tech/astack/releases/latest';
  const isPrerelease = release?.prerelease ?? true;

  // Format release date
  const formattedDate = release?.published_at
    ? new Date(release.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  // Don't show loading state to avoid layout shift
  if (loading) {
    return null;
  }

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-[#00F0FF]/5">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00F0FF]/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 py-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-sm">
          {/* Release info */}
          <div className="flex items-center flex-wrap justify-center sm:justify-start gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="font-semibold text-[#00F0FF]">
                {isPrerelease ? 'BETA' : 'RELEASE'}
              </span>
              {formattedDate && (
                <span className="text-gray-500 text-xs">{formattedDate}</span>
              )}
            </div>

            {/* Version announcement */}
            <p className="text-gray-300">
              <span className="font-medium">AStack {version}</span> is now
              available!
            </p>

            {/* Install command */}
            <code className="hidden sm:inline-block px-2 py-0.5 rounded glass text-xs font-mono text-gray-400">
              npm install @astack-tech/core
            </code>
          </div>

          {/* Release notes link */}
          <Link
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white group"
          >
            <span>Release notes</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
