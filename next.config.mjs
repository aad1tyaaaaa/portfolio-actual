/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/contact', destination: '/contact.html' },
    ]
  },
  async redirects() {
    return [{ source: '/contact.html', destination: '/contact', permanent: true }]
  },
}

export default nextConfig
