'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRightIcon } from '@phosphor-icons/react';

interface Release {
  tag_name: string;
  html_url: string;
  published_at?: string;
}
export default function BetaNotification() {
  const [release, setRelease] = useState<Release | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github-release', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const data = await response.json();
        if (
          typeof data.tag_name === 'string' &&
          typeof data.html_url === 'string' &&
          data.html_url.startsWith('https://github.com/astack-tech/astack/releases/')
        )
          setRelease(data);
      })
      .catch(() => {
        /* The static beta announcement remains useful offline. */
      });
    return () => controller.abort();
  }, []);
  return (
    <div className="announcement">
      <div className="shell announcement-inner">
        <span>
          <span className="release-label">{release ? release.tag_name : 'Public beta'}</span> AStack
          is under active development. Build with us.
        </span>
        <a href={release?.html_url ?? 'https://github.com/astack-tech/astack/releases'}>
          Release notes <ArrowUpRightIcon size={13} />
        </a>
      </div>
    </div>
  );
}
