/**
 * lib/monthlyContentData.js
 * Gom logic tinh du lieu cho 3 loai bai viet dinh ky hang thang - dung chung cho ca
 * API HTTP (pages/api/du-lieu-*.js, cho tools ben ngoai goi) VA cron job noi bo
 * (pages/api/cron/bai-viet-thang.js) - goi ham truc tiep, khong can tu goi HTTP chinh minh.
 */
const { buildMonthDashboard } = require('./tuViDashboard');
const { convertSolar2Lunar, getTietKhi } = require('./lunar');
const { getTruc, getSuggestedActivities } = require('./dayQuality');
const { getNgayKhongMinh } = require('./khongMinh');
const { getGioHoangDao } = require('./gioHoangDao');
const { getBestAndWorstDays } = require('./periodRating');
const { getMonthCard } = require('./tarot');
const occasions = require('../content/occasions.json');

function daysInMonth(mm, yyyy) { return new Date(yyyy, mm, 0).getDate(); }

function buildTuViThangData(mm, yyyy) {
  const dashboard = buildMonthDashboard(mm, yyyy);
  const sorted = [...dashboard.all].sort((a, b) => b.score - a.score);

  return {
    mm,
    yyyy,
    tongQuanThang: dashboard.tongQuan,
    chiSoThang: dashboard.indexScores,
    ngayTotNhat: dashboard.best,
    timelineTheoTuan: dashboard.timeline,
    conGiapXepHangMayMan: sorted.map((item, i) => ({
      hangMayMan: i + 1,
      conGiap: item.conGiap,
      menh: item.hanh,
      diem: item.score,
      canCu: item.quanHeNguHanh,
      congDanh: item.congDanh,
      taiLoc: item.taiLoc,
      tinhDuyen: item.tinhDuyen,
      mauMayMan: item.mauMayMan
    })),
    urlChiTiet: 'https://www.trimenh.com/tu-vi-thang'
  };
}

function buildLichThangData(mm, yyyy) {
  const total = daysInMonth(mm, yyyy);
  const dates = Array.from({ length: total }, (_, i) => ({ dd: i + 1, mm, yyyy }));

  let hoangDaoCount = 0;
  let hacDaoCount = 0;
  const khongMinhTot = [];
  const khongMinhXau = [];
  const tietKhiTrongThang = new Set();

  dates.forEach(({ dd }) => {
    const lunar = convertSolar2Lunar(dd, mm, yyyy);
    const truc = getTruc(dd, mm, yyyy, lunar.month);
    const { isGoodDay } = getSuggestedActivities(truc);
    if (isGoodDay) hoangDaoCount++; else hacDaoCount++;

    const km = getNgayKhongMinh(lunar.day, lunar.month);
    if (km) {
      const entry = { dd, mm, yyyy, ten: km.ten };
      if (km.tot) khongMinhTot.push(entry); else khongMinhXau.push(entry);
    }

    const tk = getTietKhi(dd, mm, yyyy);
    if (tk) tietKhiTrongThang.add(tk);
  });

  const { best } = getBestAndWorstDays(dates, 6, 0);
  const bestWithGio = best.map((d) => ({
    dd: d.dd, mm: d.mm, yyyy: d.yyyy, thu: d.thu, stars: d.stars,
    gioHoangDao: getGioHoangDao(d.dd, d.mm, d.yyyy).slice(0, 3).map((g) => `${g.chi} (${g.khung})`)
  }));

  return {
    mm,
    yyyy,
    soNgayTrongThang: total,
    tongSoNgayHoangDao: hoangDaoCount,
    tongSoNgayHacDao: hacDaoCount,
    ngayDepNhatThang: bestWithGio,
    ngayKhongMinhTot: khongMinhTot.slice(0, 5),
    ngayKhongMinhXau: khongMinhXau.slice(0, 5),
    tietKhiTrongThang: Array.from(tietKhiTrongThang),
    danhSachViecPhoBien: occasions.map((o) => o.label),
    luuY: 'Ngày tốt cho mọi việc (khai trương, cưới hỏi, động thổ, xuất hành, cắt tóc...) hiện dùng chung đánh giá Hoàng đạo/Hắc đạo tổng quát, chưa phân biệt riêng theo từng việc cụ thể.',
    urlChiTiet: 'https://www.trimenh.com/xem-ngay-tot'
  };
}

function buildLaBaiThangData(mm, yyyy) {
  const { card, upright } = getMonthCard(mm, yyyy);
  return {
    mm,
    yyyy,
    tenLa: card.nameVi,
    tenLaGoc: card.nameEn,
    xuoiHayNguoc: upright ? 'Xuôi' : 'Ngược',
    tuKhoa: upright ? card.keywordsUpright : card.keywordsReversed,
    yNghiaTongQuan: upright ? card.meaningUpright : card.meaningReversed,
    urlChiTiet: `https://www.trimenh.com/tarot/${card.slug}`
  };
}

module.exports = { buildTuViThangData, buildLichThangData, buildLaBaiThangData };
