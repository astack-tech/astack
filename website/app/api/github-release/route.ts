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
      headers['Authorization'] = `token ${token}`;
      console.log('Using GitHub token for release API (length:', token.length, ')');
    } else {
      console.log('No GitHub token found for release API');
    }

    console.log('Fetching latest release from GitHub API...');
    const response = await fetch(
      'https://api.github.com/repos/astack-tech/astack/releases/latest',
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    console.log('GitHub API response status (release):', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error details (release):', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500),
        rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
        rateLimitReset: response.headers.get('x-ratelimit-reset'),
      });

      // If 404, try to fetch all releases
      if (response.status === 404) {
        console.log('No latest release found, trying to fetch all releases...');
        const allReleasesResponse = await fetch(
          'https://api.github.com/repos/astack-tech/astack/releases',
          {
            headers,
            next: { revalidate: 3600 },
          }
        );

        console.log('All releases response status:', allReleasesResponse.status);

        if (allReleasesResponse.ok) {
          const allReleases = await allReleasesResponse.json();
          console.log('Found releases:', allReleases.length);

          if (allReleases && allReleases.length > 0) {
            const latestRelease = allReleases[0];
            console.log('Using first release:', latestRelease.tag_name);
            return NextResponse.json({
              tag_name: latestRelease.tag_name,
              name: latestRelease.name,
              published_at: latestRelease.published_at,
              html_url: latestRelease.html_url,
            });
          } else {
            console.log('No releases found in repository');
          }
        } else {
          const allReleasesError = await allReleasesResponse.text();
          console.error('Failed to fetch all releases:', {
            status: allReleasesResponse.status,
            body: allReleasesError.substring(0, 500),
          });
        }
      }

      return NextResponse.json(
        { error: 'Failed to fetch latest release', release: null },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully fetched latest release:', data.tag_name);
    return NextResponse.json({
      tag_name: data.tag_name,
      name: data.name,
      published_at: data.published_at,
      html_url: data.html_url,
    });
  } catch (error) {
    console.error('Failed to fetch latest release (exception):', error);
    return NextResponse.json(
      { error: 'Internal server error', release: null },
      { status: 500 }
    );
  }
}
