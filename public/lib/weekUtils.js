/**
 * lib/weekUtils.js
 * Tính số tuần ISO (dùng cho URL /tu-vi-tuan/tuan-28-nam-2026) và liệt kê
 * các ngày trong 1 tuần / 1 tháng để đánh giá "ngày đẹp nhất".
 */

function getISOWeekInfo(dd, mm, yyyy) {
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return { week, year: date.getUTCFullYear() };
}

function getMondayOfISOWeek(week, year) {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay();
  if (dow <= 4) simple.setUTCDate(simple.getUTCDate() - dow + 1);
  else simple.setUTCDate(simple.getUTCDate() + 8 - dow);
  return { dd: simple.getUTCDate(), mm: simple.getUTCMonth() + 1, yyyy: simple.getUTCFullYear() };
}

function getWeekDates(week, year) {
  const monday = getMondayOfISOWeek(week, year);
  const dates = [];
  const d = new Date(Date.UTC(monday.yyyy, monday.mm - 1, monday.dd));
  for (let i = 0; i < 7; i++) {
    dates.push({ dd: d.getUTCDate(), mm: d.getUTCMonth() + 1, yyyy: d.getUTCFullYear() });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dates;
}

function getMonthDates(mm, yyyy) {
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  const dates = [];
  for (let d = 1; d <= daysInMonth; d++) dates.push({ dd: d, mm, yyyy });
  return dates;
}

module.exports = { getISOWeekInfo, getMondayOfISOWeek, getWeekDates, getMonthDates };
