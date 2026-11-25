import crypto from 'crypto';

export const SITE = () => (process.env.MAIL_SITE_URL || 'https://trimenh.com').replace(/\/$/, '');
const secret = () => process.env.EMAIL_SECRET || process.env.ADMIN_PASSWORD || 'doi-bien-moi-truong-EMAIL_SECRET';

export function sign(text) {
  return crypto.createHmac('sha256', secret()).update(text).digest('hex').slice(0, 32);
}
export function verify(text, sig) {
  const a = Buffer.from(sign(text));
  const b = Buffer.from(String(sig || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const enc = (e) => Buffer.from(e, 'utf8').toString('base64url');
export const dec = (s) => Buffer.from(String(s || ''), 'base64url').toString('utf8');

/** Link bấm trong email: xác nhận hoặc hủy. Chữ ký riêng cho từng việc, không dùng chéo được. */
export function link(action, email) {
  return `${SITE()}/api/${action}?e=${enc(email)}&s=${sign(`${action}:${email}`)}`;
}
export function readLink(action, query) {
  const email = dec(query.e).toLowerCase();
  return email && verify(`${action}:${email}`, query.s) ? email : null;
}
