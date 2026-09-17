/**
 * pages/api/du-lieu-la-bai-thang.js
 * Tra ve la bai Tarot dai dien cho ca thang (tinh xac dinh, giong nhau cho moi nguoi xem)
 * dang JSON - dung lam nguon du lieu THAT cho content bot viet bai "La Bai Tarot Cua Thang".
 *
 * Cach goi: GET https://www.trimenh.com/api/du-lieu-la-bai-thang
 *           GET https://www.trimenh.com/api/du-lieu-la-bai-thang?mm=8&yyyy=2026
 */
import { getMonthCard } from '../../lib/tarot';
import { getVietnamNow } from '../../lib/vnDate';

const SUIT_LABEL = { wands: 'Gậy', cups: 'Cốc', swords: 'Kiếm', pentacles: 'Tiền' };

export default function handler(req, res) {
  const today = getVietnamNow();
  const mm = req.query.mm ? Number(req.query.mm) : today.getMonth() + 1;
  const yyyy = req.query.yyyy ? Number(req.query.yyyy) : today.getFullYear();

  if (mm < 1 || mm > 12) {
    return res.status(400).json({ error: 'Tháng không hợp lệ (1-12)' });
  }

  try {
    const { card, upright } = getMonthCard(mm, yyyy);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json({
      mm,
      yyyy,
      tenLa: card.nameVi,
      tenLaGoc: card.nameEn,
      loaiLa: card.arcana === 'major' ? 'Ẩn Chính' : `Ẩn Phụ — Bộ ${SUIT_LABEL[card.suit] || card.suit}`,
      xuoiHayNguoc: upright ? 'Xuôi' : 'Ngược',
      tuKhoa: upright ? card.keywordsUpright : card.keywordsReversed,
      yNghiaTongQuan: upright ? card.meaningUpright : card.meaningReversed,
      thongDiepNgan: upright ? card.dailyMessageUpright : card.dailyMessageReversed,
      urlChiTiet: `https://www.trimenh.com/tarot/${card.slug}`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
