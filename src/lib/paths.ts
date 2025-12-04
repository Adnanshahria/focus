/**
 * Path utilities for basePath-aware routing.
 * Handles both Vercel (root) and GitHub Pages (subdirectory) deployments.
 */

export function getBasePath(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  }
  return window.location.pathname.split('/').slice(0, -1).join('/') || '';
}

/**
 * Navigate to a path, accounting for basePath.
 * Next.js Link component handles this automatically, but router.push() doesn't.
 * This is a workaround for GitHub Pages deployments.
 */
export function getNavigationPath(path: string): string {
  if (path === '/' || path === '') {
    return '/';
  }
  return path;
}

/**
 * Get the manifest path relative to the app's base
 */
export function getManifestPath(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath ? `${basePath}/manifest.json` : '/manifest.json';
}
