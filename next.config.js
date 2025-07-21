/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // ...other experimental options
  }
  // Removed metadataBase (set in app/layout.tsx if needed)
}

module.exports = nextConfig; 