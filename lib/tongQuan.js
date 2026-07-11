/**
 * lib/tongQuan.js
 * Chọn đoạn "Tổng quan" (ngày/tuần/tháng) theo seed - rule-based, không gọi AI runtime.
 * Đúng nguyên tắc sản phẩm: Rule Engine + Knowledge Base, AI chỉ (nếu có) tổng hợp câu chữ
 * ở backend, không hiển thị nhãn "AI" ra ngoài giao diện.
 */
const pool = require('../content/zodiac/tong-quan.json');

function pick(arr, seed) {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function getTongQuanNgay(seed) {
  return pick(pool.ngay, seed);
}

function getTongQuanTuan(seed) {
  return pick(pool.tuan, seed);
}

function getTongQuanThang(seed) {
  return pick(pool.thang, seed);
}

module.exports = { getTongQuanNgay, getTongQuanTuan, getTongQuanThang };
