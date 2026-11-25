import { hget, hset } from '../../lib/redis';
import { sendMail } from '../../lib/mailer';
import { readLink } from '../../lib/emailToken';
import { welcomeEmail } from '../../lib/emailTemplates';

export default async function handler(req, res) {
  const email = readLink('confirm', req.query);
  if (!email) return res.redirect(302, '/dang-ky/loi');
  try {
    const cur = (await hget('subscribers', email)) || {};
    const first = !cur.welcomeSent;
    await hset('subscribers', email, { ...cur, status: 'active', confirmedAt: new Date().toISOString(), welcomeSent: true });
    if (first) {
      const m = welcomeEmail(email);
      await sendMail({ to: email, subject: m.subject, html: m.html, text: m.text, unsubscribeUrl: m.unsubscribeUrl }).catch(() => {});
    }
    return res.redirect(302, '/dang-ky/xac-nhan');
  } catch {
    return res.redirect(302, '/dang-ky/loi');
  }
}
