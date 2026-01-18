/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/geoserver-api/:path*',
        destination: 'http://localhost:8080/geoserver/:path*', // Redirection vers GeoServer
      },
    ];
  },
};

export default nextConfig;