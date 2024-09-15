/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config here
  experimental: {
    // Enable SWC
    swcMinify: true,
  },
}

module.exports = nextConfig