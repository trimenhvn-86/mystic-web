/**
 * pages/api/du-lieu-thang.js
 * Tra ve du lieu van trinh thang cua ca 12 con giap dang JSON - dung lam nguon du lieu
 * THAT (khong phai AI tu bia) de content bot (tools.visamon) doc va viet bai tong hop
 * "Van may 12 con giap thang X" kieu VnExpress.
 *
 * LUU Y: getTuViThang() KHONG co san diem so rieng tung con giap (chi co van ban tuong
 * thuat rut tu pool theo seed). De xep hang "may man nhat", tai dung DUNG cong thuc
 * getDayIndexScores() da co san trong lib/dayRating.js (deterministic, cung seed voi
 * noi dung van ban da chon) - lay chi so "mayMan" lam diem xep hang, khong bia so moi.
 *
 * Cach goi: GET https://www.trimenh.com/api/du-lieu-thang
 *           GET https://www.trimenh.com/api/du-lieu-thang?mm=8&yyyy=2026
 */
import { buildMonthDashboard } from '../../lib/tuViDashboard';
import { getDayIndexScores } from '../../lib/dayRating';
import { CHI } from '../../lib/lunar';
import { getVietnamNow } from '../../lib/vnDate';

export default function handler(req, res) {
  const today = getVietnamNow();
  const mm = req.query.mm ? Number(req.query.mm) : today.getMonth() + 1;
  const yyyy = req.query.yyyy ? Number(req.query.yyyy) : today.getFullYear();

  if (mm < 1 || mm > 12) {
    return res.status(400).json({ error: 'Tháng không hợp lệ (1-12)' });
  }

  try {
    const dashboard = buildMonthDashboard(mm, yyyy);
    const monthBucket = yyyy * 12 + mm;

    const withScore = dashboard.all.map((item) => {
      const chiIndex = CHI.indexOf(item.conGiap);
      const seed = monthBucket + chiIndex * 7;
      const diem = getDayIndexScores(seed).mayMan;
      return { ...item, diem };
    });
    const sorted = [...withScore].sort((a, b) => b.diem - a.diem);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json({
      mm,
      yyyy,
      tongQuanThang: dashboard.tongQuan,
      chiSoThang: dashboard.indexScores,
      ngayTotNhat: dashboard.best,
      ngayCanTranh: dashboard.worst,
      timelineTheoTuan: dashboard.timeline,
      conGiapXepHangMayMan: sorted.map((item, i) => ({
        hangMayMan: i + 1,
        conGiap: item.conGiap,
        menh: item.hanh,
        congDanh: item.congDanh,
        taiLoc: item.taiLoc,
        tinhDuyen: item.tinhDuyen,
        mauMayMan: item.mauMayMan,
        diem: item.diem
      })),
      urlChiTiet: 'https://www.trimenh.com/tu-vi-thang'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
