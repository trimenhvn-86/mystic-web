/**
 * content/hubs.js
 * Cấu hình trung tâm cho kiến trúc Hub -> Tool -> Dictionary -> Guide.
 * Đây là "database cấu trúc" của site (không phải nội dung biên tập — nội dung
 * Dictionary/Guide thật nằm trong Sanity CMS, xem lib/sanity.js).
 */
const HUBS = [
  {
    slug: 'lich-ngay-tot',
    name: 'Lịch & Ngày Tốt',
    icon: 'CalendarDays',
    desc: 'Đổi lịch âm dương, xem ngày tốt, giờ hoàng đạo, Khổng Minh, Lục Nhâm.',
    priority: 1,
    tools: [
      { href: '/doi-lich-am-duong', label: 'Đổi lịch âm dương', active: true },
      { href: '/xem-ngay-tot', label: 'Xem ngày tốt', active: true },
      { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo', active: true },
      { href: '/ngay-hoang-dao', label: 'Ngày Hoàng đạo', active: true },
      { href: '/ngay-hac-dao', label: 'Ngày Hắc đạo', active: true },
      { href: '/can-chi', label: 'Can Chi', active: true },
      { href: '/tiet-khi', label: 'Tiết khí', active: true },
      { href: '/xem-ngay', label: 'Xem ngày theo việc cụ thể', active: true }
    ]
  },
  {
    slug: 'than-so-hoc-hub',
    name: 'Thần Số Học',
    icon: 'Hash',
    desc: 'Số Chủ Đạo, Số Sứ Mệnh, Số Linh Hồn, Năm cá nhân theo hệ Pythagoras.',
    priority: 3,
    cmsHub: 'than-so-hoc', // giá trị field "hub" thực tế trong Sanity (khác slug URL vì /than-so-hoc đã là trang Tool)
    tools: [
      { href: '/than-so-hoc', label: 'Lập biểu đồ thần số học', active: true },
      { href: '/con-so-may-man', label: 'Con số may mắn', active: true }
    ]
  },
  {
    slug: 'menh-phong-thuy',
    name: 'Mệnh & Phong Thủy',
    icon: 'Layers',
    desc: 'Tra cứu mệnh Ngũ hành, màu hợp, con số hợp theo năm sinh.',
    priority: 2,
    tools: [
      { href: '/menh-ngu-hanh', label: 'Tra cứu mệnh', active: true },
      { href: '/mau-sac-hop-menh', label: 'Màu hợp mệnh', active: true },
      { href: '/huong-nha-hop-tuoi', label: 'Hướng nhà hợp tuổi', active: true },
      { href: '/da-phong-thuy', label: 'Vật phẩm phong thủy', active: true }
    ]
  },
  {
    slug: 'tuoi-tuong-hop',
    name: 'Tuổi & Tương Hợp',
    icon: 'Users',
    desc: 'Xem tuổi hợp làm ăn, kết hôn, Tam hợp - Tứ hành xung.',
    priority: 4,
    tools: [
      { href: '/tuoi-hop', label: 'Tra cứu tuổi', active: true },
      { href: '/so-sanh-tuoi', label: 'So sánh tuổi 2 người', active: true },
      { href: '/xem-tuoi-ket-hon', label: 'Xem tuổi kết hôn', active: true },
      { href: '/xem-tuoi-lam-an', label: 'Xem tuổi làm ăn', active: true },
      { href: '/tam-hop', label: 'Tam hợp là gì', active: true },
      { href: '/luc-hop', label: 'Lục hợp là gì', active: true },
      { href: '/tu-hanh-xung', label: 'Tứ hành xung là gì', active: true }
    ]
  },
  {
    slug: 'tu-vi',
    name: 'Tử Vi',
    icon: 'Sun',
    desc: 'Tử vi hôm nay, theo tuần, theo tháng cho 12 con giáp.',
    priority: 5,
    tools: [
      { href: '/tu-vi-hom-nay', label: 'Tử vi hôm nay', active: true },
      { href: '/tu-vi-tuan', label: 'Tử vi tuần', active: true },
      { href: '/tu-vi-thang', label: 'Tử vi tháng', active: true }
    ]
  },
  {
    slug: 'tarot',
    name: 'Tarot',
    icon: 'CircleDot',
    desc: 'Rút bài Tarot hàng ngày, Yes/No, trọn bộ 78 lá.',
    priority: 6,
    tools: [
      { href: '/tarot-hom-nay', label: 'Tarot hôm nay', active: true },
      { href: '/rut-la-tarot', label: 'Rút 1 lá', active: true },
      { href: '/tarot-yes-no', label: 'Yes / No', active: true },
      { href: '/tarot/bo-bai', label: 'Bộ bài 78 lá', active: true }
    ]
  }
];

function getHubBySlug(slug) {
  return HUBS.find((h) => h.slug === slug) || null;
}

// Giá trị dùng để lọc field "hub" trong Sanity - khác slug URL nếu hub có cmsHub riêng
function getCmsHubValue(hub) {
  if (!hub) return null;
  return hub.cmsHub || hub.slug;
}

function getAllActiveTools() {
  return HUBS.flatMap((h) => h.tools.filter((t) => t.active).map((t) => ({ ...t, hub: h.name })));
}

module.exports = { HUBS, getHubBySlug, getAllActiveTools, getCmsHubValue };
