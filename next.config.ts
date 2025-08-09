import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todas las imágenes HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite todas las imágenes HTTP (si es necesario)
      },
    ],
  },
};

export default nextConfig;
