/**
 * Redis qua REST (Upstash, cài từ Vercel Marketplace). Không cần thư viện.
 * Vercel tự thêm biến KV_REST_API_URL và KV_REST_API_TOKEN (hoặc UPSTASH_REDIS_REST_URL/TOKEN).
 */
const URL_ = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redisConfigured = () => !!(URL_() && TOKEN());

async function cmd(args) {
  const res = await fetch(URL_(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export const hset = (key, field, value) => cmd(['HSET', key, field, typeof value === 'string' ? value : JSON.stringify(value)]);
export const hget = async (key, field) => {
  const v = await cmd(['HGET', key, field]);
  return v ? JSON.parse(v) : null;
};
export const hgetall = async (key) => {
  const flat = (await cmd(['HGETALL', key])) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) {
    try { out[flat[i]] = JSON.parse(flat[i + 1]); } catch { out[flat[i]] = flat[i + 1]; }
  }
  return out;
};
export const lpush = (key, value) => cmd(['LPUSH', key, JSON.stringify(value)]);
export const lrange = async (key, a, b) => ((await cmd(['LRANGE', key, a, b])) || []).map((s) => { try { return JSON.parse(s); } catch { return s; } });
