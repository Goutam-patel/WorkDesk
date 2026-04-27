/** @type {import('next').NextConfig} */
const backendBaseUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001').replace(
  /\/+$/,
  ''
);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;