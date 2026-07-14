/**
 * pages/api/revalidate.js
 * Goi tu content bot (tools.visamon) sau khi publish bai moi len Sanity,
 * de Next.js cap nhat ngay trang do (ISR on-demand) ma khong can build lai toan site.
 *
 * Cach goi (tu pipeline ben ngoai):
 * POST https://trimenh.com/api/revalidate
 * Headers: Content-Type: application/json
 * Body: { "secret": "xxxx", "paths": ["/tu-dien/can-chi-la-gi", "/tu-dien", "/lich-ngay-tot"] }
 *
 * - "secret" phai khop bien moi truong REVALIDATE_SECRET (dat trong Vercel).
 * - "paths" la mang cac duong dan can lam moi ngay - nen truyen ca trang chi tiet
 *   bai vua dang VA trang danh sach (/tu-dien hoac /cam-nang) VA trang Hub tuong ung,
 *   vi ca 3 cho nay deu hien thi noi dung bai do.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Chỉ chấp nhận method POST' });
  }

  const { secret, paths } = req.body || {};

  if (!process.env.REVALIDATE_SECRET) {
    return res.status(500).json({ message: 'Server chưa cấu hình REVALIDATE_SECRET' });
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Sai secret token' });
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ message: 'Thiếu "paths" (mảng đường dẫn cần làm mới)' });
  }

  const results = [];
  for (const path of paths) {
    try {
      await res.revalidate(path);
      results.push({ path, ok: true });
    } catch (err) {
      results.push({ path, ok: false, error: err.message });
    }
  }

  const allOk = results.every((r) => r.ok);
  return res.status(allOk ? 200 : 207).json({ revalidated: allOk, results });
}
