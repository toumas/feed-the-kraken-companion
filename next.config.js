/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config here
  experimental: {
    // Enable SWC
    swcMinify: true,
  },
  // If you need specific Babel configurations, you can add them here
  // babel: {
  //   // Your Babel config
  // },
}

module.exports = nextConfig