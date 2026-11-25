/**
 * scripts/build-cms-index.js
 * Gom toàn bộ bài viết (content/cms/articles/*.json) và thuật ngữ (content/cms/terms/*.json)
 * thành 1 file lib/cmsData.generated.json để website đọc lúc build (không gọi dịch vụ nào bên ngoài).
 *
 * Chạy tự động trước `npm run build` (prebuild) và `npm run dev` (predev).
 * Có thể chạy tay: node scripts/build-cms-index.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'content', 'cms', 'articles');
const TERMS_DIR = path.join(ROOT, 'content', 'cms', 'terms');
const OUT = path.join(ROOT, 'lib', 'cmsData.generated.json');

// Phải khớp 6 hub trong content/hubs.js
const HUBS = ['lich-ngay-tot', 'than-so-hoc', 'menh-phong-thuy', 'tuoi-tuong-hop', 'tu-vi', 'tarot'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];

function readDir(dir, kind, required) {
  if (!fs.existsSync(dir)) return [];
  const items = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const full = path.join(dir, file);
    let obj;
    try {
      obj = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      errors.push(`${kind}/${file}: JSON sai cú pháp (${e.message})`);
      continue;
    }
    const slug = file.replace(/\.json$/, '');
    if (!obj.slug) obj.slug = slug;
    if (obj.slug !== slug) errors.push(`${kind}/${file}: trường "slug" (${obj.slug}) phải trùng tên file (${slug})`);
    if (!SLUG_RE.test(obj.slug)) errors.push(`${kind}/${file}: slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang`);
    for (const f of required) if (!obj[f]) errors.push(`${kind}/${file}: thiếu trường "${f}"`);
    if (obj.hub && !HUBS.includes(obj.hub)) errors.push(`${kind}/${file}: hub "${obj.hub}" không hợp lệ (chọn: ${HUBS.join(', ')})`);
    if (obj.draft === true) continue; // bản nháp: không đưa lên web
    items.push(obj);
  }
  return items;
}

const articles = readDir(ARTICLES_DIR, 'articles', ['title', 'htmlContent', 'hub'])
  .map((a) => ({
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || '',
    hub: a.hub || null,
    publishedAt: a.publishedAt || null,
    updatedAt: a.updatedAt || a.publishedAt || null,
    seoTitle: a.seoTitle || null,
    seoDescription: a.seoDescription || null,
    featuredImageUrl: a.featuredImageUrl || null,
    featuredImageAlt: a.featuredImageAlt || null,
    htmlContent: a.htmlContent
  }))
  .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));

for (const a of articles) {
  const words = a.htmlContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  if (words < 300) warnings.push(`articles/${a.slug}: chỉ ${words} từ (bài mỏng dễ bị Google đánh giá thấp)`);
  if (/```|(^|\n)##\s/.test(a.htmlContent)) warnings.push(`articles/${a.slug}: còn sót cú pháp Markdown trong htmlContent`);
}

const terms = readDir(TERMS_DIR, 'terms', ['title', 'shortDefinition'])
  .map((t) => ({
    title: t.title,
    slug: t.slug,
    shortDefinition: t.shortDefinition,
    origin: t.origin || '',
    meaning: t.meaning || '',
    application: t.application || '',
    example: t.example || '',
    relatedTerms: t.relatedTerms || [],
    hub: t.hub || null,
    updatedAt: t.updatedAt || t.publishedAt || null
  }))
  .sort((a, b) => a.title.localeCompare(b.title, 'vi'));

if (errors.length) {
  console.error('\n✖ Lỗi dữ liệu nội dung — sửa các file sau rồi build lại:');
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
warnings.forEach((w) => console.warn('⚠ ' + w));

fs.writeFileSync(OUT, JSON.stringify({ articles, terms }, null, 0));
console.log(`✔ Đã gom nội dung: ${articles.length} bài cẩm nang, ${terms.length} thuật ngữ`);
