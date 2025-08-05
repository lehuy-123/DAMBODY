/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // đảm bảo đã có dòng này
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '5001', // quan trọng!
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
