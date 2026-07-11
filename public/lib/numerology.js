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

// Mui ten suc manh (Arrows of Pythagoras) - cac duong (hang/cot/cheo) day du tren luoi 3x3
// ⚠️ Ten goi va y nghia tung mui ten theo nguon pho bien, mang tinh tham khao, can chuyen gia
// kiem duyet lai truoc khi cong bo chinh thuc (khac voi Chu Dao/Su Menh... da duoc kiem chung ky hon).
const ARROW_LINES = [
  { cells: [3, 6, 9], ten: 'Mũi tên Trí Tuệ', mota: 'Tư duy logic, khả năng phân tích và học hỏi tốt.' },
  { cells: [2, 5, 8], ten: 'Mũi tên Cảm Xúc', mota: 'Nhạy cảm, giàu trực giác, dễ đồng cảm với người khác.' },
  { cells: [1, 4, 7], ten: 'Mũi tên Thực Tế', mota: 'Thực tế, kiên định, chú trọng hành động cụ thể.' },
  { cells: [3, 2, 1], ten: 'Mũi tên Kế Hoạch', mota: 'Khả năng tổ chức, lên kế hoạch và tư duy chiến lược.' },
  { cells: [6, 5, 4], ten: 'Mũi tên Ý Chí', mota: 'Ý chí mạnh mẽ, quyết tâm theo đuổi mục tiêu đã đề ra.' },
  { cells: [9, 8, 7], ten: 'Mũi tên Hoạt Động', mota: 'Năng động, thích hành động và trải nghiệm thực tế.' },
  { cells: [1, 5, 9], ten: 'Mũi tên Quyết Tâm', mota: 'Ý chí kiên định, khả năng vượt qua khó khăn để đạt mục tiêu.' },
  { cells: [3, 5, 7], ten: 'Mũi tên Tâm Linh', mota: 'Thiên hướng nội tâm, dễ tiếp cận các giá trị tinh thần sâu sắc.' }
];

function getPowerArrows(dd, mm, yyyy) {
  const digits = `${dd}${mm}${yyyy}`.split('').map(Number);
  const counts = {};
  digits.forEach((d) => { if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1; });
  return ARROW_LINES.filter((line) => line.cells.every((c) => counts[c] > 0));
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
  removeVietnameseTones,
  getPowerArrows
};
