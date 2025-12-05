import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  // Get base path from environment or default to root
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const startUrl = basePath ? `${basePath}/` : '/';
  const scope = basePath || '/';

  return {
    name: 'FocusFlow',
    short_name: 'FocusFlow',
    description: 'A modern, minimalist Pomodoro & countdown timer designed for deep work and focus.',
    start_url: startUrl,
    scope: scope,
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${basePath}/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${basePath}/icon-192-maskable.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${basePath}/icon-512-maskable.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: `${basePath}/screenshot-540x720.png`,
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: `${basePath}/screenshot-1280x720.png`,
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    categories: ['productivity'],
    shortcuts: [
      {
        name: 'Start Timer',
        short_name: 'Timer',
        description: 'Start a new focus session',
        url: startUrl,
        icons: [
          {
            src: `${basePath}/icon-96.png`,
            sizes: '96x96',
          },
        ],
      },
    ],
  };
}
