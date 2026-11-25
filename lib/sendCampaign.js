import { hgetall } from './redis';
import { sendMail } from './mailer';
import { link } from './emailToken';
import { wrap, textToHtml, textOnly } from './emailTemplates';

export async function activeList() {
  const all = await hgetall('subscribers');
  return Object.entries(all).filter(([, v]) => v && v.status === 'active').map(([e]) => e).sort();
}

export async function sendOne(email, subject, body, preheader = '') {
  const unsub = link('unsubscribe', email);
  await sendMail({
    to: email, subject,
    html: wrap({ bodyHtml: textToHtml(body), unsubscribeUrl: unsub, preheader }),
    text: `${textOnly(body)}\n\nHủy nhận: ${unsub}`,
    unsubscribeUrl: unsub
  });
}

/** Gửi một lô (mặc định 40 người/lần) để không vượt thời gian của hàm serverless. */
export async function sendBatch(list, offset, subject, body, limit = 40) {
  const slice = list.slice(offset, offset + limit);
  let sent = 0; const failed = [];
  for (let i = 0; i < slice.length; i += 8) {
    const group = slice.slice(i, i + 8);
    const rs = await Promise.allSettled(group.map((e) => sendOne(e, subject, body)));
    rs.forEach((r, k) => { if (r.status === 'fulfilled') sent++; else failed.push(group[k]); });
  }
  const next = offset + limit < list.length ? offset + limit : null;
  return { sent, failed, next, total: list.length };
}
