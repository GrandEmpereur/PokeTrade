import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
  },

  // Configuration pour les en-têtes HTTP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Ajouter des redirections si nécessaire
  async redirects() {
    const redirects = [];

    // Ajouter la redirection pour l'authentification Supabase sur localhost en dev
    if (process.env.NODE_ENV === 'development') {
      redirects.push({
        source: '/auth/confirm',
        destination: `${process.env.NEXT_PUBLIC_APP_URL || 'https://poke-trade-five.vercel.app'}/auth/confirm`,
        permanent: false,
      });
    }

    return redirects;
  },
};

export default nextConfig;
