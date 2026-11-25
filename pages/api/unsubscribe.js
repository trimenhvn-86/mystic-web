import { hget, hset } from '../../lib/redis';
import { readLink } from '../../lib/emailToken';

export default async function handler(req, res) {
  const email = readLink('unsubscribe', req.query);
  if (!email) return req.method === 'POST' ? res.status(400).end() : res.redirect(302, '/dang-ky/loi');
  try {
    const cur = (await hget('subscribers', email)) || {};
    await hset('subscribers', email, { ...cur, status: 'unsubscribed', unsubAt: new Date().toISOString() });
  } catch {
    return req.method === 'POST' ? res.status(500).end() : res.redirect(302, '/dang-ky/loi');
  }
  return req.method === 'POST' ? res.status(200).end() : res.redirect(302, '/dang-ky/huy');
}
