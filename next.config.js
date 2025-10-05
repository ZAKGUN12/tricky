/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export to enable API routes
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
