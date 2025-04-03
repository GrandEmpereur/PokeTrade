import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com', 'picsum.photos'],
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

  // Ajouter des redirections pour l'authentification Supabase
  async redirects() {
    return [
      // Toujours rediriger vers le domaine de production
      {
        source: '/auth/confirm',
        destination: 'https://poke-trade-five.vercel.app/auth/confirm',
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
