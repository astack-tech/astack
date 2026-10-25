/** Read public repository data even when an optional local token has expired. */
export async function fetchPublicGitHub(resource: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'AStack-Website',
  };
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/astack-tech/astack${resource}`;
  const options = { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) };
  if (token) {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });
    if (response.status !== 401) return response;
  }
  return fetch(url, { ...options, headers });
}
