import { guard } from '../../../lib/adminAuth';
import { redisConfigured, lpush } from '../../../lib/redis';
import { mailerConfigured } from '../../../lib/mailer';
import { activeList, sendOne, sendBatch } from '../../../lib/sendCampaign';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (guard(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  if (!mailerConfigured()) return res.status(503).json({ error: 'Chưa đặt SMTP2GO_API_KEY trên Vercel.' });
  const { mode, subject, body, testTo, offset = 0, totals } = req.body || {};
  if (!subject || !body) return res.status(400).json({ error: 'Cần có tiêu đề và nội dung.' });
  try {
    if (mode === 'test') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testTo || '')) return res.status(400).json({ error: 'Nhập email nhận thử.' });
      await sendOne(testTo, `[Thử] ${subject}`, body);
      return res.status(200).json({ ok: true });
    }
    if (mode === 'all') {
      if (!redisConfigured()) return res.status(503).json({ error: 'Chưa kết nối Upstash Redis.' });
      const list = await activeList();
      if (!list.length) return res.status(400).json({ error: 'Chưa có người đăng ký đã xác nhận.' });
      const r = await sendBatch(list, offset, subject, body);
      if (r.next === null && totals) {
        await lpush('campaigns', { at: new Date().toISOString(), subject, sent: (totals.sent || 0) + r.sent, failed: (totals.failed || 0) + r.failed.length, total: r.total }).catch(() => {});
      }
      return res.status(200).json(r);
    }
    return res.status(400).json({ error: 'Chế độ không hợp lệ.' });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Lỗi gửi email.' });
  }
}
