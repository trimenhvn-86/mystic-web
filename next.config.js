/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Không lộ "X-Powered-By: Next.js" trong header
  poweredByHeader: false,
  async redirects() {
    return [
      // Trang chủ chỉ có 1 địa chỉ chuẩn là "/"
      { source: '/index', destination: '/', permanent: true },
      // Các địa chỉ cũ (từ thời nội dung nằm trên Sanity) → bài tương ứng hiện nay
      ...[
        ['/cam-nang/ngay-hac-dao-la-gi-co-nen-kieng-moi-cong-viec-khong', '/cam-nang/ngay-hoang-dao-va-hac-dao'],
        ['/cam-nang/tam-hop-va-tu-hanh-xung-co-thuc-su-quyet-dinh-van-menh', '/cam-nang/tam-hop-luc-hop-tuong-xung'],
        ['/cam-nang/ngu-hanh-la-gi-nguon-goc-quy-luat-va-ung-dung-trong-phong-thuy', '/cam-nang/ngu-hanh-tuong-sinh-tuong-khac'],
        ['/cam-nang/cach-xem-ngay-tot-theo-lich-am-chinh-xac-cho-nguoi-moi', '/cam-nang/cach-xem-ngay-tot-xau'],
        ['/cam-nang/nam-ca-nhan-trong-than-so-hoc-la-gi', '/cam-nang/than-so-hoc-la-gi'],
        ['/tu-dien/tam-hop-la-gi', '/tu-dien/tam-hop'],
        ['/tu-dien/luc-hop-la-gi', '/cam-nang/tam-hop-luc-hop-tuong-xung'],
        ['/tu-dien/tu-hanh-xung-la-gi', '/tu-dien/tuong-xung'],
        ['/tu-dien/minor-arcana-la-gi', '/tu-dien/tarot'],
        ['/tu-dien/tarot-la-gi', '/tu-dien/tarot'],
        ['/tu-dien/chinh-tinh', '/tu-dien/bo-an-chinh'],
        ['/tu-dien/thien-can-tuong-hop-la-gi', '/tu-dien/thien-can'],
        ['/tu-dien/nam-ca-nhan-personal-year', '/tu-dien/than-so-hoc'],
        ['/tu-dien/cung-menh', '/tu-dien/tu-vi'],
        ['/tu-dien/truc-la-gi', '/tu-dien/truc']
      ].map(([source, destination]) => ({ source, destination, permanent: true }))
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
