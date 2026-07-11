/**
 * lib/tuViDashboard.js
 * Gộp dữ liệu cho trang Tử vi hôm nay (dashboard theo ngày) - tái dùng toàn bộ
 * lib đã có (lunar, dayQuality, dayRating, gioHoangDao, tuoiHop, nguHanh, tongQuan, tuViHomNay).
 */
const { CHI, convertSolar2Lunar, getCanChiNgay, jdFromDate } = require('./lunar');
const { getTruc, getSuggestedActivities } = require('./dayQuality');
const { getDayRating, getDayIndexScores } = require('./dayRating');
const { getGioHoangDao } = require('./gioHoangDao');
const { getTuoiHop } = require('./tuoiHop');
const { getNapAmByCanChi } = require('./nguHanh');
const { getTongQuanNgay } = require('./tongQuan');
const { getTuViHomNay } = require('./tuViHomNay');

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
  const tuoiHopHomNay = getTuoiHop(chiNgay);
  const napAmNgay = getNapAmByCanChi(canChiNgay);
  const all = CHI.map((chi) => getTuViHomNay(dd, mm, yyyy, chi));

  return {
    dd, mm, yyyy, lunar, canChiNgay, chiNgay, truc, activities, rating,
    indexScores, tongQuan, gioHoangDao, tuoiHopHomNay, napAmNgay, all
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
  const all = CHI.map((chi) => getTuViThang(mm, yyyy, chi));

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
