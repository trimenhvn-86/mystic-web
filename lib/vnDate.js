/**
 * lib/vnDate.js
 * May chu (Vercel) mac dinh chay theo gio UTC, lech 7 tieng so voi Viet Nam.
 * Neu dung thang new Date() trong getStaticProps (chay tren may chu luc build/regenerate),
 * tu 0h-7h sang gio VN moi ngay se bi tinh nham la "hom qua" (vi UTC luc do van la ngay truoc).
 * Ham nay luon tra ve dung ngay/gio theo mui gio Viet Nam (UTC+7), bat ke may chu o dau.
 */
function getVietnamNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000; // quy ve UTC thuc su
  const vnMs = utcMs + 7 * 60 * 60000; // UTC+7
  return new Date(vnMs);
}

module.exports = { getVietnamNow };
