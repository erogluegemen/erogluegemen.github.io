export const SITE_URL = 'https://erogluegemen.com';

export function canonicalUrl(path: string): string {
  // GitHub Pages serves react-snap's per-route output as a directory
  // (e.g. blog/index.html), 301-redirecting the no-slash path to the
  // trailing-slash form. The canonical must match that final URL.
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${SITE_URL}${withSlash}`;
}
