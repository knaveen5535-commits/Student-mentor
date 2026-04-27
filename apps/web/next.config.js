/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
