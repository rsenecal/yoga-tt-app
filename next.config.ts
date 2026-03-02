import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // For your Firebase uploads
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For placeholder images
      },
    ],
  },
};

export default nextConfig;
