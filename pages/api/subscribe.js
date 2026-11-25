import { redisConfigured, hget, hset } from '../../lib/redis';
import { mailerConfigured, sendMail } from '../../lib/mailer';
import { confirmEmail } from '../../lib/emailTemplates';

const RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email: raw, source = 'web', website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // ô ẩn dành cho bot
  const email = String(raw || '').trim().toLowerCase();
  if (!RE.test(email) || email.length > 120) return res.status(400).json({ error: 'Email chưa đúng định dạng.' });

  // Chưa cài danh sách/SMTP: vẫn báo về hộp thư chủ site qua Web3Forms như trước.
  if (!redisConfigured() || !mailerConfigured()) {
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) return res.status(503).json({ error: 'Chưa cài đặt gửi email.' });
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, subject: 'Đăng ký nhận tin từ TriMenh.com', from_name: 'TriMenh đăng ký email', email, message: `Đăng ký nhận email miễn phí. Nguồn: ${source}` })
    });
    const d = await r.json().catch(() => ({}));
    return d.success ? res.status(200).json({ ok: true, mode: 'basic' }) : res.status(502).json({ error: 'Chưa gửi được.' });
  }

  try {
    const cur = await hget('subscribers', email);
    if (cur && cur.status === 'active') return res.status(200).json({ ok: true, mode: 'confirm' }); // không lộ email đã có
    await hset('subscribers', email, { status: 'pending', source, createdAt: cur?.createdAt || new Date().toISOString(), lastConfirmSent: new Date().toISOString() });
    const m = confirmEmail(email);
    await sendMail({ to: email, subject: m.subject, html: m.html, text: m.text });
    return res.status(200).json({ ok: true, mode: 'confirm' });
  } catch (e) {
    return res.status(500).json({ error: 'Chưa gửi được email xác nhận. Bạn thử lại sau một lúc nhé.' });
  }
}
