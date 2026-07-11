/**
 * lib/tuViHomNay.js
 * Sinh nội dung Tử vi hôm nay cho 12 con giáp — xoay vòng deterministic theo ngày
 * (cùng 1 ngày luôn ra cùng 1 kết quả cho 1 con giáp, khác ngày sẽ khác nhau).
 * Không gọi AI runtime — đúng nguyên tắc "Rule Engine + Knowledge Base" trong tài liệu.
 */
const { jdFromDate, CHI } = require('./lunar');
const pool = require('../content/zodiac/tu-vi-hom-nay/mau-cau.json');

const CON_GIAP_HANH = {
  'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
  'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
  'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function adaptPeriod(text, periodLabel) {
  return text.replace(/hôm nay/g, periodLabel);
}

function getTuViHomNay(dd, mm, yy, conGiap) {
  const jd = jdFromDate(dd, mm, yy);
  const chiIndex = CHI.indexOf(conGiap);
  const seed = jd + chiIndex * 7; // lệch seed theo từng con giáp để không trùng lịch luân chuyển
  const hanh = CON_GIAP_HANH[conGiap];
  return {
    conGiap,
    hanh,
    congDanh: pick(pool.congDanh, seed),
    taiLoc: pick(pool.taiLoc, seed + 1),
    tinhDuyen: pick(pool.tinhDuyen, seed + 2),
    mauMayMan: pool.luckyColorByHanh[hanh]
  };
}

// Tra ve ngay Thu Hai cua tuan chua ngay dd/mm/yy (dung Date JS, du chinh xac cho muc dich hien thi)
function getMondayOfWeek(dd, mm, yy) {
  const d = new Date(yy, mm - 1, dd);
  const day = d.getDay(); // 0=CN
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return { dd: d.getDate(), mm: d.getMonth() + 1, yyyy: d.getFullYear() };
}

// Tu vi theo TUAN - dung chung engine, nhung seed theo "tuan" (chia het cho 7 ngay lien tiep
// se ra cung 1 ket qua) thay vi theo tung ngay rieng le.
function getTuViTuan(dd, mm, yy, conGiap) {
  const jd = jdFromDate(dd, mm, yy);
  const weekBucket = Math.floor(jd / 7);
  const chiIndex = CHI.indexOf(conGiap);
  const seed = weekBucket + chiIndex * 7;
  const hanh = CON_GIAP_HANH[conGiap];
  const monday = getMondayOfWeek(dd, mm, yy);
  const sunday = { ...monday };
  const sundayDate = new Date(monday.yyyy, monday.mm - 1, monday.dd + 6);
  sunday.dd = sundayDate.getDate();
  sunday.mm = sundayDate.getMonth() + 1;
  sunday.yyyy = sundayDate.getFullYear();
  return {
    conGiap,
    hanh,
    tongQuan: pick(pool.tongQuanTuan, seed),
    congDanh: adaptPeriod(pick(pool.congDanh, seed + 1), 'tuần này'),
    taiLoc: adaptPeriod(pick(pool.taiLoc, seed + 2), 'tuần này'),
    tinhDuyen: adaptPeriod(pick(pool.tinhDuyen, seed + 3), 'tuần này'),
    mauMayMan: pool.luckyColorByHanh[hanh],
    tuNgay: monday,
    denNgay: sunday
  };
}

// Tu vi theo THANG - seed theo (nam*12 + thang) nen ca thang ra cung 1 ket qua.
function getTuViThang(mm, yy, conGiap) {
  const monthBucket = yy * 12 + mm;
  const chiIndex = CHI.indexOf(conGiap);
  const seed = monthBucket + chiIndex * 7;
  const hanh = CON_GIAP_HANH[conGiap];
  return {
    conGiap,
    hanh,
    thang: mm,
    nam: yy,
    tongQuan: pick(pool.tongQuanThang, seed),
    congDanh: adaptPeriod(pick(pool.congDanh, seed + 1), 'tháng này'),
    taiLoc: adaptPeriod(pick(pool.taiLoc, seed + 2), 'tháng này'),
    tinhDuyen: adaptPeriod(pick(pool.tinhDuyen, seed + 3), 'tháng này'),
    mauMayMan: pool.luckyColorByHanh[hanh]
  };
}

module.exports = { getTuViHomNay, getTuViTuan, getTuViThang, CON_GIAP_HANH };
