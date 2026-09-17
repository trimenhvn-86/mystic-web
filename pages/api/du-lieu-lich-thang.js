/**
 * pages/api/du-lieu-lich-thang.js
 * Tra ve du lieu tong hop Lich & Ngay Tot cho ca thang - dung lam nguon du lieu THAT
 * (khong phai AI tu bia) de viet bai "Lich Ngay Tot Thang X" hang thang.
 *
 * Cach goi: GET https://www.trimenh.com/api/du-lieu-lich-thang
 *           GET https://www.trimenh.com/api/du-lieu-lich-thang?mm=8&yyyy=2026
 */
import { convertSolar2Lunar, getTietKhi } from '../../lib/lunar';
import { getTruc, getSuggestedActivities } from '../../lib/dayQuality';
import { getNgayKhongMinh } from '../../lib/khongMinh';
import { getGioHoangDao } from '../../lib/gioHoangDao';
import { getBestAndWorstDays } from '../../lib/periodRating';
import { getVietnamNow } from '../../lib/vnDate';
import occasions from '../../content/occasions.json';

function daysInMonth(mm, yyyy) { return new Date(yyyy, mm, 0).getDate(); }

export default function handler(req, res) {
  const today = getVietnamNow();
  const mm = req.query.mm ? Number(req.query.mm) : today.getMonth() + 1;
  const yyyy = req.query.yyyy ? Number(req.query.yyyy) : today.getFullYear();

  if (mm < 1 || mm > 12) {
    return res.status(400).json({ error: 'Tháng không hợp lệ (1-12)' });
  }

  try {
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

      try {
        const tk = getTietKhi(dd, mm, yyyy);
        if (tk) tietKhiTrongThang.add(tk);
      } catch (e) { /* bo qua neu ngoai pham vi */ }
    });

    const { best } = getBestAndWorstDays(dates, 6, 0);
    const bestWithGio = best.map((d) => ({
      thu: d.thu,
      dd: d.dd,
      mm: d.mm,
      yyyy: d.yyyy,
      stars: d.stars,
      label: d.label,
      gioHoangDao: getGioHoangDao(d.dd, d.mm, d.yyyy).slice(0, 3).map((g) => `${g.chi} (${g.khung})`)
    }));

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json({
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
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
