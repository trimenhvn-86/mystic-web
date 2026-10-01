/**
 * pages/api/du-lieu-la-bai-thang.js
 * Endpoint HTTP cong khai. Logic thuc su nam o lib/monthlyContentData.js.
 * Cach goi: GET https://www.trimenh.com/api/du-lieu-la-bai-thang?mm=8&yyyy=2026
 */
import { buildLaBaiThangData } from '../../lib/monthlyContentData';
import { getVietnamNow } from '../../lib/vnDate';

export default function handler(req, res) {
  const today = getVietnamNow();
  const mm = req.query.mm ? Number(req.query.mm) : today.getMonth() + 1;
  const yyyy = req.query.yyyy ? Number(req.query.yyyy) : today.getFullYear();

  if (mm < 1 || mm > 12) {
    return res.status(400).json({ error: 'Tháng không hợp lệ (1-12)' });
  }

  try {
    const data = buildLaBaiThangData(mm, yyyy);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
