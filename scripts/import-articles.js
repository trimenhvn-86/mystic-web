/**
 * Nhập hàng loạt từ CSV thành file JSON trong content/cms/.
 *   node scripts/import-articles.js duong-dan.csv            (bài cẩm nang)
 *   node scripts/import-articles.js duong-dan.csv --terms    (thuật ngữ từ điển)
 * Cột bài: title, slug, hub, excerpt, seoTitle, seoDescription, publishedAt, htmlContent
 * Cột thuật ngữ: title, slug, hub, shortDefinition, origin, meaning, application, example
 * CSV lưu UTF-8; ô có dấu phẩy/xuống dòng đặt trong "dấu nháy kép".
 * Sau đó: git commit + push (hoặc upload qua GitHub web) => Vercel build.
 */
const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell); if (row.some((x) => x !== '')) rows.push(row);
  return rows;
}

function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const file = process.argv[2];
const isTerms = process.argv.includes('--terms');
if (!file) { console.error('Cách dùng: node scripts/import-articles.js file.csv [--terms]'); process.exit(1); }
const rows = parseCsv(fs.readFileSync(file, 'utf8'));
const head = rows.shift().map((h) => h.trim());
const outDir = path.join(__dirname, '..', 'content', 'cms', isTerms ? 'terms' : 'articles');
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const r of rows) {
  const o = {}; head.forEach((h, i) => { if (r[i] !== undefined && r[i] !== '') o[h] = r[i]; });
  if (!o.title) continue;
  o.slug = o.slug || slugify(o.title);
  if (!isTerms && !o.publishedAt) o.publishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(outDir, o.slug + '.json'), JSON.stringify(o, null, 2) + '\n');
  n++;
}
console.log(`Đã tạo ${n} file trong ${path.relative(process.cwd(), outDir)}. Chạy "npm run build" để kiểm tra, rồi đẩy lên GitHub.`);
