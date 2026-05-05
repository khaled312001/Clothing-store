/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Backend uploads
      { protocol: 'http',  hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
      { protocol: 'http',  hostname: '127.0.0.1', port: '4000', pathname: '/uploads/**' },
    ],
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
