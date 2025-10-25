/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Disable image optimization for standalone build
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
