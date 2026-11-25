import { guard } from '../../../lib/adminAuth';
import { redisConfigured, hgetall, lrange } from '../../../lib/redis';

export default async function handler(req, res) {
  if (guard(req, res)) return;
  if (!redisConfigured()) return res.status(200).json({ configured: false, list: [], counts: {}, campaigns: [] });
  const all = await hgetall('subscribers');
  const list = Object.entries(all).map(([email, v]) => ({ email, ...v })).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const counts = { active: 0, pending: 0, unsubscribed: 0 };
  list.forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1; });
  const campaigns = await lrange('campaigns', 0, 19).catch(() => []);
  if (req.query.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="nguoi-dang-ky.csv"');
    return res.send('﻿email,trang_thai,nguon,ngay_dang_ky,ngay_xac_nhan\n' + list.map((s) => [s.email, s.status, s.source || '', s.createdAt || '', s.confirmedAt || ''].join(',')).join('\n'));
  }
  return res.status(200).json({ configured: true, list, counts, campaigns });
}
