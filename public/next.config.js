/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
