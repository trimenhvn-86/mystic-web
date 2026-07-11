/**
 * lib/periodRating.js
 * Chấm điểm nhiều ngày liên tiếp (dùng cho "Ngày đẹp nhất trong tuần/tháng").
 */
const { convertSolar2Lunar } = require('./lunar');
const { getTruc } = require('./dayQuality');
const { getDayRating } = require('./dayRating');

const THU_VN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function rateDates(dates) {
  return dates.map(({ dd, mm, yyyy }) => {
    const lunar = convertSolar2Lunar(dd, mm, yyyy);
    const truc = getTruc(dd, mm, yyyy, lunar.month);
    const rating = getDayRating(truc);
    const thu = THU_VN[new Date(yyyy, mm - 1, dd).getDay()];
    return { dd, mm, yyyy, thu, ...rating };
  });
}

function getBestAndWorstDays(dates, bestCount = 5, worstCount = 3) {
  const rated = rateDates(dates);
  const sorted = [...rated].sort((a, b) => b.stars - a.stars);
  const best = sorted.filter((d) => d.stars >= 4).slice(0, bestCount);
  const worst = sorted.filter((d) => d.stars <= 2).slice(-worstCount).reverse();
  return { rated, best, worst };
}

module.exports = { rateDates, getBestAndWorstDays };
