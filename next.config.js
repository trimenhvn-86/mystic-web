/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Không lộ "X-Powered-By: Next.js" trong header
  poweredByHeader: false,
  async redirects() {
    return [
      // Trang chủ chỉ có 1 địa chỉ chuẩn là "/"
      { source: '/index', destination: '/', permanent: true }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ]
  },
  // Site URL dùng cho sitemap generator — đổi khi có domain thật
  env: {
    SITE_URL: process.env.SITE_URL || 'https://domain.com'
  }
};

module.exports = nextConfig;
