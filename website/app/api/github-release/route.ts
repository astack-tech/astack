import { NextResponse } from 'next/server';

import { fetchPublicGitHub } from '@/lib/github';
import { isRecord } from '@/lib/json';

export async function GET(): Promise<NextResponse> {
  try {
    // Include prereleases while AStack is in beta.
    const response = await fetchPublicGitHub('/releases?per_page=1');
    if (!response.ok) {
      return NextResponse.json({ release: null }, { status: 503 });
    }
    const releases: unknown = await response.json();
    const release: unknown = Array.isArray(releases) ? releases[0] : null;
    if (!isRecord(release)) {
      return NextResponse.json({ release: null });
    }
    return NextResponse.json({
      tag_name: release['tag_name'],
      name: release['name'],
      published_at: release['published_at'],
      html_url: release['html_url'],
    });
  } catch {
    return NextResponse.json({ release: null }, { status: 503 });
  }
}
