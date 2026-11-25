import { guard } from '../../../lib/adminAuth';
import { getVietnamNow } from '../../../lib/vnDate';
import { buildLichThangData, buildLaBaiThangData } from '../../../lib/monthlyContentData';
import { monthlyDraft, halfMonthDraft } from '../../../lib/emailTemplates';

/** Tạo nháp email lịch tháng tới (hoặc tháng chỉ định) từ số liệu thật của hệ thống. */
export default function handler(req, res) {
  if (guard(req, res)) return;
  const now = getVietnamNow();
  if (req.query.kieu === 'nua-thang') {
    // Gửi trước ngày 15: lấy tháng hiện tại nếu chưa qua ngày 14, ngược lại tháng sau
    let m = now.getMonth() + 1, y = now.getFullYear();
    if (now.getDate() > 14) { m += 1; if (m > 12) { m = 1; y += 1; } }
    return res.status(200).json({ mm: m, yyyy: y, ...halfMonthDraft(m, y) });
  }
  let mm = parseInt(req.query.mm, 10);
  let yyyy = parseInt(req.query.yyyy, 10);
  if (!mm || !yyyy) { mm = now.getMonth() + 2; yyyy = now.getFullYear(); if (mm > 12) { mm = 1; yyyy += 1; } }
  const draft = monthlyDraft(buildLichThangData(mm, yyyy), buildLaBaiThangData(mm, yyyy), mm, yyyy);
  res.status(200).json({ mm, yyyy, ...draft });
}
