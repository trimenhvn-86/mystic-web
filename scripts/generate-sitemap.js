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
  '/trai-bai-3-la',
  '/tarot/bo-bai',
  '/huong-nha-hop-tuoi',
  '/tuoi-hop',
  '/so-sanh-tuoi',
  '/tam-hop',
  '/luc-hop',
  '/tu-hanh-xung',
  '/xem-ngay',
  '/xem-tuoi-ket-hon',
  '/xem-tuoi-lam-an',
  ...HUBS.map((h) => `/${h.slug}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map((n) => `/than-so-hoc/so-chu-dao-${n}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-hom-nay/${slug}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-tuan/${slug}`),
  ...Object.values(CHI_SLUG).map((slug) => `/tu-vi-thang/${slug}`),
  ...require('../content/tarot-cards.json').map((c) => `/tarot/${c.slug}`),
  ...require('../content/occasions.json').map((o) => `/xem-ngay/${o.slug}`),
  ...require('../content/tarot-spreads.json').map((s) => `/trai-bai-3-la/${s.slug}`)
];

// Cac tool theo ngay - sinh cho 60 ngay toi (ISR fallback:'blocking' se tu render neu Google
// crawl ngay ngoai pham vi nay, nhung dua vao sitemap giup Google uu tien crawl truoc)
// ngay-hoang-dao, ngay-hac-dao, can-chi, tiet-khi theo ngày: noindex (trùng nội dung) => không đưa vào sitemap
const DAILY_TOOLS = ['xem-ngay-tot', 'doi-lich-am-duong', 'gio-hoang-dao'];
// Tử vi theo ngày: chỉ ngày gần (7 ngày trước, 7 ngày tới) vì giá trị thời sự
const TUVI_DAILY_RANGE = [-7, 7];
const dailyUrls = [];
const today = new Date();
for (let i = -7; i <= 60; i++) { // chỉ khoảng gần; noindex ngoài -3/+12 tháng đã xử lý ở trang
  const d = new Date(today);
  d.setDate(d.getDate() + i);
  const slug = `ngay-${pad(d.getDate())}-thang-${pad(d.getMonth() + 1)}-nam-${d.getFullYear()}`;
  DAILY_TOOLS.forEach((tool) => dailyUrls.push(`/${tool}/${slug}`));
  if (i >= TUVI_DAILY_RANGE[0] && i <= TUVI_DAILY_RANGE[1]) dailyUrls.push(`/tu-vi-hom-nay/${slug}`);
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
    const { getDictionaryTerms, getGuidePosts } = require('../lib/content');
    const [terms, posts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);
    return [
      ...terms.map((t) => ({ loc: `/tu-dien/${t.slug}`, lastmod: t.updatedAt })),
      ...posts.map((p) => ({ loc: `/cam-nang/${p.slug}`, lastmod: p.updatedAt || p.publishedAt }))
    ];
  } catch (err) {
    console.error('⚠ Không lấy được dữ liệu Sanity cho sitemap (sitemap-noi-dung sẽ trống):', err.message);
    return [];
  }
}

function isoDate(d) {
  const x = d ? new Date(d) : new Date();
  return Number.isNaN(x.getTime()) ? new Date().toISOString().slice(0, 10) : x.toISOString().slice(0, 10);
}

function escXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// items: [{ loc, lastmod? }] — loại URL trùng nhau, luôn có <lastmod>
function buildXml(items, defaultLastmod) {
  const seen = new Set();
  const rows = [];
  for (const it of items) {
    const loc = typeof it === 'string' ? it : it.loc;
    if (seen.has(loc)) continue;
    seen.add(loc);
    const lm = isoDate((typeof it === 'object' && it.lastmod) || defaultLastmod);
    rows.push(`  <url><loc>${escXml(SITE_URL + loc)}</loc><lastmod>${lm}</lastmod></url>`);
  }
  return {
    count: rows.length,
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`
  };
}

async function main() {
  const cmsUrls = await getCmsUrls();
  const todayIso = isoDate();

  // Tách theo nhóm để theo dõi riêng trong Search Console (nhóm nào bị "đã thu thập – chưa lập chỉ mục" thì thấy ngay)
  const groups = [
    { file: 'sitemap-trang-chinh.xml', items: staticUrls },
    { file: 'sitemap-theo-ngay.xml', items: [...dailyUrls, ...periodUrls] },
    { file: 'sitemap-theo-nam-sinh.xml', items: yearUrls },
    { file: 'sitemap-noi-dung.xml', items: cmsUrls }
  ];

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Xóa sitemap con cũ để không còn file mồ côi
  fs.readdirSync(outDir).filter((f) => /^sitemap-.*\.xml$/.test(f)).forEach((f) => fs.unlinkSync(path.join(outDir, f)));

  const indexRows = [];
  let total = 0;
  for (const g of groups) {
    const { xml, count } = buildXml(g.items, todayIso);
    if (count === 0) continue; // không đưa sitemap rỗng vào index
    fs.writeFileSync(path.join(outDir, g.file), xml);
    indexRows.push(`  <sitemap><loc>${SITE_URL}/${g.file}</loc><lastmod>${todayIso}</lastmod></sitemap>`);
    total += count;
    console.log(`  - ${g.file}: ${count} URL`);
  }
  // sitemap.xml giữ nguyên địa chỉ cũ nhưng giờ là sitemap index
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexRows.join('\n')}\n</sitemapindex>\n`
  );
  console.log(`✔ sitemap.xml (index) đã tạo, tổng ${total} URL, ${indexRows.length} sitemap con`);
}

main();
