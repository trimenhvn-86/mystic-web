/**
 * lib/lucNham.js
 * "Lục Nhâm Tướng Pháp" (cách tính giờ tốt xấu của Lý Thuần Phong).
 * Công thức: (Ngày âm + Tháng âm + Khắc giờ định đi - 2) / 6 = số dư
 *
 * ⚠️ LƯU Ý: Tài liệu nguồn chỉ định nghĩa 6 Khắc cho khoảng 23h-11h (nửa ngày).
 * Để tính được cho cả 24h, module này GIẢ ĐỊNH chu kỳ 6 Khắc lặp lại 1 lần nữa
 * cho nửa ngày còn lại (11h-23h) — đây là suy luận hợp lý theo cách tính Lục Nhâm
 * phổ biến (12 giờ Chi / ngày, lặp lại 6 tên 2 lần), nhưng CẦN chuyên gia xác nhận
 * lại trước khi công bố chính thức.
 */
const data = require('../content/lunar/luc-nham/bang-gio.json');

// Trả về Khắc giờ (1-6) dựa trên giờ trong ngày (0-23), chu kỳ 2 giờ/Khắc,
// bắt đầu từ 23h (Khắc 1: 23h-1h, Khắc 2: 1h-3h, ... Khắc 6: 9h-11h, rồi lặp lại).
function getKhacGio(hour) {
  const adjusted = (hour + 1) % 24;
  const block = Math.floor(adjusted / 2); // 0..11
  return (block % 6) + 1;
}

function getLucNham(lunarDay, lunarMonth, hour) {
  const khacGio = getKhacGio(hour);
  const total = lunarDay + lunarMonth + khacGio - 2;
  let soDu = total % 6;
  if (soDu === 0) soDu = 6;
  const info = data.gio[soDu];
  return { soDu, khacGio, ...info };
}

module.exports = { getKhacGio, getLucNham };
