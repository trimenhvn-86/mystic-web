/**
 * lib/luckyNumber.js
 * Kết hợp Số Chủ Đạo (thần số học) + Ngũ hành năm sinh (Hà Đồ) để gợi ý con số may mắn.
 */
const { calcLifePathNumber } = require('./numerology');
const { getMenhNguHanh } = require('./nguHanh');

// Số theo Ngũ hành dựa trên Hà Đồ truyền thống
const HA_DO = {
  Thủy: [1, 6],
  Hỏa: [2, 7],
  Mộc: [3, 8],
  Kim: [4, 9],
  Thổ: [5, 0]
};

function getLuckyNumbers(day, month, year) {
  const lifePath = calcLifePathNumber(day, month, year);
  const menh = getMenhNguHanh(year);
  const hanhNumbers = menh ? HA_DO[menh.hanh] : [];
  // Gộp số chủ đạo + số theo ngũ hành, loại trùng
  const combined = Array.from(new Set([lifePath, ...hanhNumbers]));
  return { lifePath, hanh: menh?.hanh, hanhNumbers, luckyNumbers: combined };
}

module.exports = { getLuckyNumbers, HA_DO };
