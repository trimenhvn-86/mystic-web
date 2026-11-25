/**
 * Tự gửi email lịch tháng tới. CHỈ chạy khi AUTO_SEND_EMAIL=true trên Vercel (mặc định tắt).
 * Vercel Cron gọi vào ngày 25 hằng tháng (xem vercel.json). Bảo vệ bằng CRON_SECRET như cron bài viết.
 */
import { getVietnamNow } from '../../../lib/vnDate';
import { buildLichThangData, buildLaBaiThangData } from '../../../lib/monthlyContentData';
import { monthlyDraft } from '../../../lib/emailTemplates';
import { activeList, sendBatch } from '../../../lib/sendCampaign';
import { lpush } from '../../../lib/redis';

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();
  if (process.env.AUTO_SEND_EMAIL !== 'true') return res.status(200).json({ skipped: 'AUTO_SEND_EMAIL chưa bật' });
  const now = getVietnamNow();
  let mm = now.getMonth() + 2, yyyy = now.getFullYear();
  if (mm > 12) { mm = 1; yyyy += 1; }
  const { subject, body } = monthlyDraft(buildLichThangData(mm, yyyy), buildLaBaiThangData(mm, yyyy), mm, yyyy);
  const list = await activeList();
  let offset = 0, sent = 0, failed = 0;
  while (offset !== null) {
    const r = await sendBatch(list, offset, subject, body);
    sent += r.sent; failed += r.failed.length; offset = r.next;
  }
  await lpush('campaigns', { at: new Date().toISOString(), subject, sent, failed, total: list.length, auto: true }).catch(() => {});
  return res.status(200).json({ sent, failed });
}
