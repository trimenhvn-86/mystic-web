/**
 * scripts/generate-sitemap.js
 * Chạy sau `next build` (xem "postbuild" trong package.json).
 * Sinh sitemap.xml đầy đủ gồm: trang tĩnh, 6 Hub, các tool theo ngày (60 ngày tới),
 * các trang theo năm sinh (1940-hiện tại), 12 con giáp, và nội dung Từ điển/Cẩm nang
 * lấy trực tiếp từ Sanity CMS lúc build.
 *
 * Nếu tổng URL vượt 50.000 (giới hạn 1 sitemap file của Google), cần tách thành
 * nhiều file con + sitemap index — hiện tại quy mô site chưa cần tới mức đó.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://trimenh.com';

const HUBS = require('../content/hubs').HUBS;
const { CHI_SLUG } = require('../lib/chiSlug');

function pad(n) {
  return String(n).padStart(2, '0');
}

// Cac trang tinh co dinh
const staticUrls = [
  '/',
  '/gioi-thieu',
  '/lien-he',
  '/tu-dien',
  '/cam-nang',
  '/doi-lich-am-duong',
  '/xem-ngay-tot',
  '/gio-hoang-dao',
  '/ngay-hoang-dao',
  '/ngay-hac-dao',
  '/can-chi',
  '/tiet-khi',
  '/than-so-hoc',
  '/con-so-may-man',
  '/tu-vi-hom-nay',
  '/tu-vi-tuan',
  '/tu-vi-thang',
  '/menh-ngu-hanh',
  '/mau-sac-hop-menh',
  '/da-phong-thuy',
  '/tarot-hom-nay',
  '/rut-la-tarot',
  '/tarot-yes-no',
  '/tarot/bo-bai',
  '/huong-nha-hop-tuoi',
  '/tuoi-hop',
  '/so-sanh-tuoi',
  '/xem-tuoi-ket-hon',
  '/xem-tuoi-lam-an',
  ...HUBS.map((h) => `/${h.slug}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((n) => `/than-so-hoc/so-chu-dao-${n}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-hom-nay/${slug}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-tuan/${slug}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-thang/${slug}`),
  ...require('../content/tarot-cards.json').map((c) => `/tarot/${c.slug}`)
];

// Cac tool theo ngay - sinh cho 60 ngay toi (ISR fallback:'blocking' se tu render neu Google
// crawl ngay ngoai pham vi nay, nhung dua vao sitemap giup Google uu tien crawl truoc)
const DAILY_TOOLS = ['xem-ngay-tot', 'doi-lich-am-duong', 'gio-hoang-dao', 'ngay-hoang-dao', 'ngay-hac-dao', 'can-chi', 'tiet-khi', 'tu-vi-hom-nay'];
const dailyUrls = [];
const today = new Date();
for (let i = -7; i <= 60; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() + i);
  const slug = `ngay-${pad(d.getDate())}-thang-${pad(d.getMonth() + 1)}-nam-${d.getFullYear()}`;
  DAILY_TOOLS.forEach((tool) => dailyUrls.push(`/${tool}/${slug}`));
}

// Tu vi tuan (8 tuan toi) va tu vi thang (6 thang toi)
const { getISOWeekInfo } = require('../lib/weekUtils');
const periodUrls = [];
for (let i = 0; i < 8; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() + i * 7);
  const { week, year } = getISOWeekInfo(d.getDate(), d.getMonth() + 1, d.getFullYear());
  periodUrls.push(`/tu-vi-tuan/tuan-${week}-nam-${year}`);
}
for (let i = 0; i < 6; i++) {
  const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
  periodUrls.push(`/tu-vi-thang/thang-${pad(d.getMonth() + 1)}-nam-${d.getFullYear()}`);
}

// Cac trang theo nam sinh (1940 - nam hien tai)
const currentYear = new Date().getFullYear();
const yearUrls = [];
for (let y = 1940; y <= currentYear; y++) {
  yearUrls.push(`/${y}-menh-gi`);
  yearUrls.push(`/${y}-hop-tuoi-nao`);
  yearUrls.push(`/${y}-hop-mau-gi`);
  yearUrls.push(`/${y}-hop-da-gi`);
}

async function getCmsUrls() {
  try {
    const { getDictionaryTerms, getGuidePosts } = require('../lib/sanity');
    const [terms, posts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);
    return [
      ...terms.map((t) => `/tu-dien/${t.slug}`),
      ...posts.map((p) => `/cam-nang/${p.slug}`)
    ];
  } catch (err) {
    console.error('Không lấy được dữ liệu Sanity cho sitemap:', err.message);
    return [];
  }
}

function buildXml(urls) {
  const items = urls
    .map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

async function main() {
  const cmsUrls = await getCmsUrls();
  const allUrls = [...staticUrls, ...dailyUrls, ...periodUrls, ...yearUrls, ...cmsUrls];

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildXml(allUrls));
  console.log(`✔ sitemap.xml đã tạo với ${allUrls.length} URL tại public/sitemap.xml`);
  console.log(`  - Trang tĩnh: ${staticUrls.length}`);
  console.log(`  - Tool theo ngày (60 ngày x ${DAILY_TOOLS.length} tool): ${dailyUrls.length}`);
  console.log(`  - Trang theo năm sinh: ${yearUrls.length}`);
  console.log(`  - Nội dung CMS (Từ điển + Cẩm nang): ${cmsUrls.length}`);
}

main();
