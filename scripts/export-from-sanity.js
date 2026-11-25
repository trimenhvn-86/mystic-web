/**
 * Xuất toàn bộ bài + thuật ngữ từ Sanity thành file JSON trong content/cms/ (chạy MỘT LẦN khi Sanity hết quota/đã reset).
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=13pf0iga SANITY_API_TOKEN=... node scripts/export-from-sanity.js
 * Cần: npm install (đã có @sanity/client). Bài dạng htmlContent giữ nguyên; bài dạng Portable Text (body) được đổi sang HTML đơn giản.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '13pf0iga',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return '';
  let out = '', list = false;
  for (const b of blocks) {
    if (b._type !== 'block') continue;
    const txt = (b.children || []).map((c) => {
      let t = esc(c.text || '');
      if ((c.marks || []).includes('strong')) t = `<strong>${t}</strong>`;
      if ((c.marks || []).includes('em')) t = `<em>${t}</em>`;
      return t;
    }).join('');
    if (b.listItem) { if (!list) { out += '<ul>'; list = true; } out += `<li>${txt}</li>`; continue; }
    if (list) { out += '</ul>'; list = false; }
    const tag = /^h[1-6]$/.test(b.style) ? (b.style === 'h1' ? 'h2' : b.style) : 'p';
    out += `<${tag}>${txt}</${tag}>`;
  }
  return out + (list ? '</ul>' : '');
}
const write = (dir, slug, obj) => {
  const d = path.join(__dirname, '..', 'content', 'cms', dir);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, slug + '.json'), JSON.stringify(obj, null, 2) + '\n');
};

(async () => {
  const arts = await client.fetch(`*[_type=="article" && defined(slug.current)]{title,"slug":slug.current,excerpt,hub,publishedAt,"updatedAt":_updatedAt,seoTitle,seoDescription,htmlContent,body}`);
  for (const a of arts) {
    const { body, ...rest } = a;
    write('articles', a.slug, { ...rest, htmlContent: a.htmlContent || blocksToHtml(body) });
  }
  const terms = await client.fetch(`*[_type=="dictionaryTerm" && defined(slug.current)]{title,"slug":slug.current,shortDefinition,origin,meaning,application,example,hub,"updatedAt":_updatedAt}`);
  for (const t of terms) write('terms', t.slug, t);
  console.log(`Đã xuất ${arts.length} bài, ${terms.length} thuật ngữ.`);
})().catch((e) => { console.error('Lỗi:', e.message); process.exit(1); });
