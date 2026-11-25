import crypto from 'crypto';
import { sign, verify } from './emailToken';

const COOKIE = 'tm_admin';
export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function checkPassword(pw) {
  const a = crypto.createHash('sha256').update(String(pw || '')).digest();
  const b = crypto.createHash('sha256').update(String(process.env.ADMIN_PASSWORD || '')).digest();
  return adminConfigured() && crypto.timingSafeEqual(a, b);
}
export function makeCookie() {
  const exp = Date.now() + 12 * 3600 * 1000;
  const val = `${exp}.${sign(`admin:${exp}`)}`;
  return `${COOKIE}=${val}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${12 * 3600}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isAdmin(req) {
  if (!adminConfigured()) return false;
  const m = String(req.headers.cookie || '').match(/(?:^|;\s*)tm_admin=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  return Number(exp) > Date.now() && verify(`admin:${exp}`, sig);
}
/** Dùng đầu mỗi API admin: trả true nếu đã chặn. */
export function guard(req, res) {
  if (!isAdmin(req)) { res.status(401).json({ error: 'Chưa đăng nhập' }); return true; }
  return false;
}
