export function getBaseUrl(request: Request): string {
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return process.env.PUBLIC_URL || 'http://localhost:5173';
  }

  // In production, try to get the URL from the request
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
