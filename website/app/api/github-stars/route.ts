import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AStack-Website',
    };

    // Add GitHub token if available (from environment variable)
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      // Support both classic tokens (ghp_) and fine-grained tokens (github_pat_)
      headers['Authorization'] = `token ${token}`;
      console.log('Using GitHub token (length:', token.length, ')');
    } else {
      console.log('No GitHub token found, using unauthenticated request');
    }

    console.log('Fetching from GitHub API...');
    const response = await fetch(
      'https://api.github.com/repos/astack-tech/astack',
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    console.log('GitHub API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500), // First 500 chars
        rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
        rateLimitReset: response.headers.get('x-ratelimit-reset'),
      });
      return NextResponse.json(
        { error: 'Failed to fetch stars', stars: null },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully fetched stars:', data.stargazers_count);
    return NextResponse.json({ stars: data.stargazers_count });
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);
    return NextResponse.json(
      { error: 'Internal server error', stars: null },
      { status: 500 }
    );
  }
}
