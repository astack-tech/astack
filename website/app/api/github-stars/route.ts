import { NextResponse } from 'next/server';

import { fetchPublicGitHub } from '@/lib/github';
import { isRecord } from '@/lib/json';

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetchPublicGitHub('');
    if (!response.ok) {
      return NextResponse.json({ stars: null }, { status: 503 });
    }
    const repository: unknown = await response.json();
    const stars = isRecord(repository) ? repository['stargazers_count'] : null;
    return NextResponse.json({ stars: typeof stars === 'number' ? stars : null });
  } catch {
    return NextResponse.json({ stars: null }, { status: 503 });
  }
}
