/**
 * lib/khongMinh.js
 * Tính "Ngày tốt xuất hành của Cụ Khổng Minh" theo ngày & tháng Âm lịch.
 * Nguồn: bảng tra cứu truyền thống (ngày âm lịch, áp dụng mọi năm) — xem
 * content/lunar/khong-minh/bang-ngay.json để biết chi tiết dữ liệu và lưu ý kiểm duyệt.
 */
const data = require('../content/lunar/khong-minh/bang-ngay.json');

function getGroup(lunarMonth) {
  if (data.A.thang.includes(lunarMonth)) return data.A;
  if (data.B.thang.includes(lunarMonth)) return data.B;
  if (data.C.thang.includes(lunarMonth)) return data.C;
  return null;
}

function getNgayKhongMinh(lunarDay, lunarMonth) {
  const group = getGroup(lunarMonth);
  if (!group) return null;
  const idx = (lunarDay - 1) % group.chuKy;
  const ten = group.thuTu[idx];
  const info = group.luanGiai[ten];
  return { ten, tot: info.tot, luanGiai: info.text };
}

module.exports = { getNgayKhongMinh, getGroup };
