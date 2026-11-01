'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRightIcon } from '@phosphor-icons/react';

import { isRecord } from '@/lib/json';

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
        if (!response.ok) {
          return;
        }
        const data: unknown = await response.json();
        if (!isRecord(data)) {
          return;
        }
        const tagName = data['tag_name'];
        const htmlUrl = data['html_url'];
        if (
          typeof tagName === 'string' &&
          typeof htmlUrl === 'string' &&
          htmlUrl.startsWith('https://github.com/astack-tech/astack/releases/')
        ) {
          setRelease({ tag_name: tagName, html_url: htmlUrl });
        }
      })
      .catch(() => {
        /* The static beta announcement remains useful offline. */
      });
    return () => {
      controller.abort();
    };
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
