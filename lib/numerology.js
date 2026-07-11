/**
 * lib/numerology.js
 * Tính toán các chỉ số Thần số học (hệ Pythagoras).
 */

// Bảng chữ -> số theo Pythagoras
const LETTER_MAP = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

// Bỏ dấu tiếng Việt để map sang chữ Latin
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

const MASTER_NUMBERS = new Set([11, 22, 33]);

function reduceNumber(num) {
  while (num > 9 && !MASTER_NUMBERS.has(num)) {
    num = String(num)
      .split('')
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return num;
}

// Số Chủ Đạo — từ ngày tháng năm sinh
function calcLifePathNumber(day, month, year) {
  const digits = `${day}${month}${year}`.split('').reduce((s, d) => s + Number(d), 0);
  return reduceNumber(digits);
}

// Số Sứ Mệnh — từ toàn bộ họ tên (quy đổi Pythagoras)
function calcDestinyNumber(fullName) {
  const clean = removeVietnameseTones(fullName).toLowerCase().replace(/[^a-z]/g, '');
  const sum = clean.split('').reduce((s, ch) => s + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(sum);
}

// Số Linh Hồn — từ nguyên âm trong tên
function calcSoulUrgeNumber(fullName) {
  const clean = removeVietnameseTones(fullName).toLowerCase().replace(/[^a-z]/g, '');
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  const sum = clean
    .split('')
    .filter((ch) => vowels.has(ch))
    .reduce((s, ch) => s + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(sum);
}

// Chỉ số Năm Cá Nhân — dựa trên ngày/tháng sinh + năm hiện tại
function calcPersonalYearNumber(day, month, currentYear) {
  const digits = `${day}${month}${currentYear}`.split('').reduce((s, d) => s + Number(d), 0);
  return reduceNumber(digits);
}

// Số Biểu Đạt (Personality Number) — từ phụ âm trong tên
function calcPersonalityNumber(fullName) {
  const clean = removeVietnameseTones(fullName).toLowerCase().replace(/[^a-z]/g, '');
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  const sum = clean
    .split('')
    .filter((ch) => !vowels.has(ch))
    .reduce((s, ch) => s + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(sum);
}

// Số Trưởng Thành — tổng Số Chủ Đạo + Số Sứ Mệnh, rút gọn
function calcMaturityNumber(lifePathNumber, destinyNumber) {
  return reduceNumber(lifePathNumber + destinyNumber);
}

// Tháng cá nhân — dựa trên Năm cá nhân + tháng hiện tại
function calcPersonalMonthNumber(personalYearNumber, currentMonth) {
  return reduceNumber(personalYearNumber + currentMonth);
}

// Ngày cá nhân — dựa trên Tháng cá nhân + ngày hiện tại
function calcPersonalDayNumber(personalMonthNumber, currentDay) {
  return reduceNumber(personalMonthNumber + currentDay);
}

// Các số còn thiếu trong ngày sinh (chỉ tính trên chữ số ngày/tháng/năm sinh)
function getMissingNumbers(day, month, year) {
  const digits = new Set(`${day}${month}${year}`.split('').map(Number));
  const missing = [];
  for (let n = 1; n <= 9; n++) {
    if (!digits.has(n)) missing.push(n);
  }
  return missing;
}

// Bảng tương hợp tham khảo giữa các Số Chủ Đạo (kiến thức phổ biến, mang tính tham khảo)
const COMPAT_TABLE = {
  1: [3, 5, 6], 2: [4, 6, 8], 3: [1, 5, 7], 4: [2, 6, 8], 5: [1, 3, 7],
  6: [1, 2, 4], 7: [3, 5, 9], 8: [2, 4, 6], 9: [3, 6, 7],
  11: [2, 6, 9], 22: [4, 6, 8], 33: [6, 9, 11]
};

function getCompatibleNumbers(lifePathNumber) {
  return COMPAT_TABLE[lifePathNumber] || [];
}

module.exports = {
  reduceNumber,
  calcLifePathNumber,
  calcDestinyNumber,
  calcSoulUrgeNumber,
  calcPersonalYearNumber,
  calcPersonalityNumber,
  calcMaturityNumber,
  calcPersonalMonthNumber,
  calcPersonalDayNumber,
  getMissingNumbers,
  getCompatibleNumbers,
  removeVietnameseTones
};
