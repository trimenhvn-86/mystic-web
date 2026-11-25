/**
 * content/promos.js
 * Nội dung các banner / CTA trong bài viết và sidebar. Chỉnh chữ ở ĐÂY, không cần sửa component.
 *
 * - placement: 'inline' (giữa bài, cuối bài), 'sidebar' (cột phải)
 * - enabled: false thì không hiện (dùng cho gói trả phí chưa mở)
 * - kind: 'newsletter' (khung nhập email) hoặc 'link' (banner dẫn đến một trang)
 */
const PROMOS = [
  {
    id: 'email-ngay-tot',
    enabled: true,
    kind: 'newsletter',
    placement: ['inline', 'sidebar'],
    title: 'Nhận lịch ngày tốt tháng tới',
    text: 'Mỗi tháng một email: ngày đẹp, ngày nên tránh, giờ Hoàng đạo. Hủy bất cứ lúc nào.',
    button: 'Nhận lịch miễn phí'
  },
  {
    id: 'tra-cuu-mien-phi',
    enabled: true,
    kind: 'link',
    placement: ['inline'],
    title: 'Tra mệnh, xem ngày, rút bài tarot: tất cả miễn phí',
    text: 'Chỉ cần nhập ngày sinh hoặc chọn ngày cần xem, kết quả có ngay, không cần đăng ký.',
    button: 'Xem các công cụ',
    href: '/xem-ngay-tot'
  },
  {
    // Gói trả phí: bật enabled khi sẵn sàng, chỉnh chữ và đường dẫn.
    id: 'goi-tra-phi',
    enabled: false,
    kind: 'link',
    placement: ['inline', 'sidebar'],
    title: 'Gói xem chuyên sâu',
    text: 'Luận giải chi tiết theo ngày sinh của bạn.',
    button: 'Tìm hiểu gói',
    href: '/lien-he'
  }
];

function getPromos(placement) {
  return PROMOS.filter((p) => p.enabled && p.placement.includes(placement));
}

module.exports = { PROMOS, getPromos };
