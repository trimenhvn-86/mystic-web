import { guard } from '../../../lib/adminAuth';
import { getVietnamNow } from '../../../lib/vnDate';
import { buildLichThangData, buildLaBaiThangData } from '../../../lib/monthlyContentData';
import { monthlyDraft } from '../../../lib/emailTemplates';

/** Tạo nháp email lịch tháng tới (hoặc tháng chỉ định) từ số liệu thật của hệ thống. */
export default function handler(req, res) {
  if (guard(req, res)) return;
  const now = getVietnamNow();
  let mm = parseInt(req.query.mm, 10);
  let yyyy = parseInt(req.query.yyyy, 10);
  if (!mm || !yyyy) { mm = now.getMonth() + 2; yyyy = now.getFullYear(); if (mm > 12) { mm = 1; yyyy += 1; } }
  const draft = monthlyDraft(buildLichThangData(mm, yyyy), buildLaBaiThangData(mm, yyyy), mm, yyyy);
  res.status(200).json({ mm, yyyy, ...draft });
}
