/**
 * Normalizes a URL by ensuring it has a proper scheme (http:// or https://)
 * Defaults to https:// if no scheme is provided
 * Falls back to localhost:3000 for development if no URL is provided
 */
export function normalizeUrl(url?: string): string {
  let normalizedUrl = url || 'http://localhost:3000';
  
  // If URL doesn't start with a scheme, add https://
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    // Use https in production, http for localhost
    const scheme = normalizedUrl.includes('localhost') ? 'http://' : 'https://';
    normalizedUrl = `${scheme}${normalizedUrl}`;
  }
  
  return normalizedUrl;
}

/**
 * Gets the base URL for the application with proper scheme
 */
export function getBaseUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
}