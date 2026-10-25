import { NextResponse } from 'next/server';
import { fetchPublicGitHub } from '@/lib/github';

export async function GET() {
  try {
    const response = await fetchPublicGitHub('');
    if (!response.ok) return NextResponse.json({ stars: null }, { status: 503 });
    const repository = await response.json();
    return NextResponse.json({ stars: repository.stargazers_count });
  } catch {
    return NextResponse.json({ stars: null }, { status: 503 });
  }
}
