import { checkPassword, makeCookie, clearCookie, adminConfigured } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method === 'DELETE') { res.setHeader('Set-Cookie', clearCookie()); return res.status(200).json({ ok: true }); }
  if (req.method !== 'POST') return res.status(405).end();
  if (!adminConfigured()) return res.status(503).json({ error: 'Chưa đặt biến ADMIN_PASSWORD trên Vercel.' });
  await new Promise((r) => setTimeout(r, 600)); // làm chậm việc đoán mật khẩu
  if (!checkPassword((req.body || {}).password)) return res.status(401).json({ error: 'Sai mật khẩu.' });
  res.setHeader('Set-Cookie', makeCookie());
  return res.status(200).json({ ok: true });
}
