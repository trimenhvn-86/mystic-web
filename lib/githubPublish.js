/**
 * lib/githubPublish.js
 * Đăng bài bằng cách tạo/ghi đè 1 file JSON trong repo GitHub (content/cms/articles|terms/<slug>.json).
 * Commit lên nhánh chính => Vercel tự build lại => bài xuất hiện trên web.
 *
 * Biến môi trường:
 *   GITHUB_TOKEN   - Personal access token (Fine-grained: chọn repo mystic-web, quyền Contents: Read and write)
 *   GITHUB_REPO    - mặc định trimenhvn-86/mystic-web
 *   GITHUB_BRANCH  - mặc định main
 */
const REPO = process.env.GITHUB_REPO || 'trimenhvn-86/mystic-web';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

async function gh(path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'trimenh-cms',
      ...(options.headers || {})
    }
  });
  return res;
}

/** kind: 'articles' | 'terms'. doc: object (không cần slug, hàm tự gắn). */
async function publishContentFile(kind, slug, doc, message) {
  if (!process.env.GITHUB_TOKEN) throw new Error('Thiếu biến môi trường GITHUB_TOKEN');
  const path = `content/cms/${kind}/${slug}.json`;
  let sha;
  const existing = await gh(`${path}?ref=${BRANCH}`);
  if (existing.ok) sha = (await existing.json()).sha;
  else if (existing.status !== 404) throw new Error(`GitHub đọc file lỗi ${existing.status}: ${await existing.text()}`);

  const content = Buffer.from(JSON.stringify({ ...doc, slug }, null, 2) + '\n', 'utf8').toString('base64');
  const res = await gh(path, {
    method: 'PUT',
    body: JSON.stringify({ message: message || `Đăng ${kind}/${slug}`, content, branch: BRANCH, ...(sha ? { sha } : {}) })
  });
  if (!res.ok) throw new Error(`GitHub ghi file lỗi ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = { publishContentFile };
