/**
 * lib/tuViDashboard.js
 * Gộp dữ liệu cho trang Tử vi hôm nay (dashboard theo ngày) - tái dùng toàn bộ
 * lib đã có (lunar, dayQuality, dayRating, gioHoangDao, tuoiHop, nguHanh, tongQuan, tuViHomNay).
 */
const { CHI, convertSolar2Lunar, getCanChiNgay, getCanChiThang, jdFromDate } = require('./lunar');
const { getTruc, getSuggestedActivities } = require('./dayQuality');
const { getDayRating, getDayIndexScores } = require('./dayRating');
const { getGioHoangDao, getGioHacDao } = require('./gioHoangDao');
const { getTuoiHop } = require('./tuoiHop');
const { getNapAmByCanChi, getNguHanhRelation, getNguHanhExtra } = require('./nguHanh');
const { getTongQuanNgay } = require('./tongQuan');
const { getTuViHomNay } = require('./tuViHomNay');

const CON_GIAP_HANH = {
  'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
  'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
  'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

/**
 * Tinh diem may man cua 1 con giap trong 1 thang, dua tren quan he Ngu Hanh THAT
 * (tuong sinh/tuong khac) giua Ngu hanh cua thang (tinh tu Can Chi thang -> Nap am)
 * va Ngu hanh cua con giap do - KHONG phai xep hang tuy tien/tu bia.
 *
 * Quy tac (dua theo ly thuyet Ngu Hanh truyen thong):
 * - Thang sinh cho tuoi (thang la nguon nuoi duong)      -> rat tot
 * - Tuoi khac thang (tuoi chu dong, "thang" phai nhuong) -> kha tot
 * - Dong hanh (cung mot Ngu hanh)                        -> on dinh, trung binh
 * - Tuoi sinh cho thang (tuoi phai "cho di" nang luong)  -> hoi vat va
 * - Thang khac tuoi (tuoi bi che ep)                     -> kem, can than trong
 */
function getMonthLuckScore(monthHanh, chiHanh) {
  if (monthHanh === chiHanh) return { score: 65, quanHe: 'dong-hanh' };
  const monthExtra = getNguHanhExtra(monthHanh);
  const chiExtra = getNguHanhExtra(chiHanh);

  if (monthExtra.sinhRa === chiHanh) return { score: 90, quanHe: 'thang-sinh-tuoi' };
  if (chiExtra.sinhRa === monthHanh) return { score: 55, quanHe: 'tuoi-sinh-thang' };
  if (monthExtra.khac === chiHanh) return { score: 30, quanHe: 'thang-khac-tuoi' };
  if (chiExtra.khac === monthHanh) return { score: 75, quanHe: 'tuoi-khac-thang' };
  return { score: 50, quanHe: 'binh-thuong' };
}

function getThangHanh(mm, yyyy) {
  const midMonthLunar = convertSolar2Lunar(15, mm, yyyy);
  const canChiThang = getCanChiThang(midMonthLunar.month, midMonthLunar.year);
  const napAm = getNapAmByCanChi(canChiThang);
  return napAm ? napAm.hanh : null;
}

function buildDayDashboard(dd, mm, yyyy) {
  const lunar = convertSolar2Lunar(dd, mm, yyyy);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const chiNgay = canChiNgay.split(' ')[1];
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const activities = getSuggestedActivities(truc);
  const rating = getDayRating(truc);
  const jd = jdFromDate(dd, mm, yyyy);
  const indexScores = getDayIndexScores(jd);
  const tongQuan = getTongQuanNgay(jd);
  const gioHoangDao = getGioHoangDao(dd, mm, yyyy);
  const gioHacDao = getGioHacDao(dd, mm, yyyy);
  const tuoiHopHomNay = getTuoiHop(chiNgay);
  const napAmNgay = getNapAmByCanChi(canChiNgay);
  const all = CHI.map((chi) => getTuViHomNay(dd, mm, yyyy, chi));

  return {
    dd, mm, yyyy, lunar, canChiNgay, chiNgay, truc, activities, rating,
    indexScores, tongQuan, gioHoangDao, gioHacDao, tuoiHopHomNay, napAmNgay, all
  };
}

const { getTuViTuan, getTuViThang } = require('./tuViHomNay');
const { getTongQuanTuan, getTongQuanThang } = require('./tongQuan');
const { getISOWeekInfo, getMondayOfISOWeek, getWeekDates, getMonthDates } = require('./weekUtils');
const { getBestAndWorstDays } = require('./periodRating');

function buildWeekDashboard(week, year) {
  const monday = getMondayOfISOWeek(week, year);
  const dates = getWeekDates(week, year);
  const sunday = dates[6];
  const jdMonday = jdFromDate(monday.dd, monday.mm, monday.yyyy);
  const weekBucket = Math.floor(jdMonday / 7);

  const tongQuan = getTongQuanTuan(weekBucket);
  const indexScores = getDayIndexScores(weekBucket);
  const { rated, best, worst } = getBestAndWorstDays(dates, 5, 3);
  const all = CHI.map((chi) => getTuViTuan(monday.dd, monday.mm, monday.yyyy, chi));

  return { week, year, monday, sunday, dates, tongQuan, indexScores, rated, best, worst, all };
}

function buildMonthDashboard(mm, yyyy) {
  const dates = getMonthDates(mm, yyyy);
  const monthBucket = yyyy * 12 + mm;

  const tongQuan = getTongQuanThang(monthBucket);
  const indexScores = getDayIndexScores(monthBucket);
  const { rated, best, worst } = getBestAndWorstDays(dates, 5, 3);
  const thangHanh = getThangHanh(mm, yyyy);
  const all = CHI.map((chi) => {
    const data = getTuViThang(mm, yyyy, chi);
    const chiHanh = CON_GIAP_HANH[chi];
    const luck = thangHanh ? getMonthLuckScore(thangHanh, chiHanh) : { score: 50, quanHe: 'khong-xac-dinh' };
    return { ...data, score: luck.score, quanHeNguHanh: luck.quanHe };
  });

  // Nhom theo tuan ISO de lam timeline "Tuan 1..Tuan N"
  const weekGroups = [];
  let currentWeekKey = null;
  rated.forEach((d) => {
    const info = getISOWeekInfo(d.dd, d.mm, d.yyyy);
    const key = `${info.year}-${info.week}`;
    if (key !== currentWeekKey) {
      weekGroups.push({ key, days: [] });
      currentWeekKey = key;
    }
    weekGroups[weekGroups.length - 1].days.push(d);
  });
  const timeline = weekGroups.map((g, i) => {
    const avgStars = Math.round(g.days.reduce((s, d) => s + d.stars, 0) / g.days.length);
    return { label: `Tuần ${i + 1}`, stars: avgStars };
  });

  return { mm, yyyy, dates, tongQuan, indexScores, rated, best, worst, all, timeline };
}

module.exports = { buildDayDashboard, buildWeekDashboard, buildMonthDashboard };
