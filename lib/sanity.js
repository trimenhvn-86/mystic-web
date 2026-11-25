/**
 * lib/sanity.js
 * Kết nối tới Sanity CMS (dùng để quản lý Dictionary, Guide/Cẩm nang, Banner quảng cáo).
 *
 * CÁCH THIẾT LẬP: xem file SANITY_SETUP.md ở gốc project.
 * Cần 3 biến môi trường (thêm trong Vercel Settings → Environment Variables):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (thường là "production")
 *   SANITY_API_TOKEN             (chỉ cần nếu muốn xem bản nháp/chưa publish)
 *
 * Nếu chưa cấu hình Sanity, các hàm bên dưới trả về mảng/giá trị rỗng thay vì lỗi,
 * để site vẫn chạy bình thường trong lúc chờ bạn thiết lập CMS.
 */
const { createClient } = require('@sanity/client');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const isConfigured = Boolean(projectId);

const client = isConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      // Tắt CDN: nội dung được ISR cache ở Vercel rồi, CDN Sanity chỉ làm tăng nguy cơ
      // hết quota/trả dữ liệu cũ hoặc rỗng.
      useCdn: false,
      token: process.env.SANITY_API_TOKEN || undefined
    })
  : null;

/**
 * Bộ nhớ đệm trong tiến trình (5 phút). Trước đây mỗi trang dựng ra đều gọi Sanity 2 lần
 * (danh sách từ điển + danh sách bài) => hàng nghìn trang theo ngày làm cạn hạn mức "API Requests".
 * Giờ cùng một truy vấn chỉ gọi 1 lần trong 5 phút trên mỗi tiến trình. Lỗi thì KHÔNG được cache.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
const memo = new Map();
function cachedFetch(query, params) {
  const key = query + '|' + JSON.stringify(params || {});
  const hit = memo.get(key);
  if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.p;
  const p = client.fetch(query, params);
  memo.set(key, { t: Date.now(), p });
  p.catch(() => { if (memo.get(key) && memo.get(key).p === p) memo.delete(key); });
  return p;
}

/**
 * Dùng cho nội dung quan trọng (bài viết, từ điển).
 * Khi Sanity lỗi (sai token, hết quota, mạng...) hàm này NÉM LỖI thay vì trả mảng rỗng.
 * Lý do: Next.js ISR giữ nguyên bản trang cũ khi getStaticProps ném lỗi; nếu trả rỗng/null thì
 * trang cũ bị ghi đè thành "không có bài" hoặc 404 và bị cache.
 * Chỉ khi chưa cấu hình Sanity (không có project ID) mới trả giá trị dự phòng.
 */
async function strictFetch(query, params = {}, fallback = []) {
  if (!isConfigured) return fallback;
  try {
    return await cachedFetch(query, params);
  } catch (err) {
    console.error('Sanity fetch error:', err.message);
    // CHẾ ĐỘ TẠM khi Sanity hết hạn mức: đặt SANITY_BUILD_OFFLINE=true trong Vercel thì LÚC BUILD
    // lỗi Sanity không làm hỏng build (trang dựng với nội dung CMS rỗng). Chạy bình thường (runtime)
    // vẫn ném lỗi để ISR giữ bản cũ. Sau khi Sanity hoạt động lại: xóa biến này rồi Redeploy.
    const isBuilding =
      process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build';
    if (process.env.SANITY_BUILD_OFFLINE === 'true' && isBuilding) {
      console.warn('SANITY_BUILD_OFFLINE: bỏ qua lỗi Sanity lúc build, dùng nội dung CMS rỗng');
      return fallback;
    }
    throw err;
  }
}

// Dùng cho phần phụ (banner): lỗi thì bỏ qua, không làm hỏng cả trang.
async function safeFetch(query, params = {}, fallback = []) {
  if (!isConfigured) return fallback;
  try {
    return await cachedFetch(query, params);
  } catch (err) {
    console.error('Sanity fetch error:', err.message);
    return fallback;
  }
}

// ---- Dictionary (Từ điển huyền học) ----
async function getDictionaryTerms() {
  return strictFetch(
    `*[_type == "dictionaryTerm" && defined(slug.current)] | order(title asc){ title, "slug": slug.current, shortDefinition, hub, "updatedAt": _updatedAt }`,
    {},
    []
  );
}

async function getDictionaryTermBySlug(slug) {
  return strictFetch(
    `*[_type == "dictionaryTerm" && slug.current == $slug][0]{
      title, "slug": slug.current, shortDefinition, origin, meaning, application, example, relatedTerms, hub
    }`,
    { slug },
    null
  );
}

// ---- Guide (Cẩm nang) ----
async function getGuidePosts() {
  return strictFetch(
    `*[_type == "article" && defined(slug.current)] | order(publishedAt desc){
      title, "slug": slug.current, excerpt, hub, publishedAt, "updatedAt": _updatedAt,
      "featuredImageUrl": featuredImage.asset->url
    }`,
    {},
    []
  );
}

async function getGuidePostBySlug(slug) {
  return strictFetch(
    `*[_type == "article" && slug.current == $slug][0]{
      title, "slug": slug.current, excerpt, body, htmlContent, hub, publishedAt,
      seoTitle, seoDescription,
      "featuredImageUrl": featuredImage.asset->url,
      "featuredImageAlt": featuredImage.alt
    }`,
    { slug },
    null
  );
}

// ---- Banner quảng cáo ----
async function getActiveBanners(placement) {
  return safeFetch(
    `*[_type == "banner" && placement == $placement && active == true]{
      title, "imageUrl": image.asset->url, linkUrl, placement
    }`,
    { placement },
    []
  );
}

async function getHubContentPreview(hubSlug, limit = 4) {
  // Khối "bài liên quan" chỉ là phần phụ: nếu Sanity lỗi thì bỏ trống khối này chứ không làm hỏng
  // cả trang công cụ (nếu không, trang theo ngày mới sẽ trả 500).
  let terms = [];
  let posts = [];
  try {
    [terms, posts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);
  } catch (err) {
    return { dictionaryPreview: [], guidePreview: [] };
  }

  const hubTerms = terms.filter((t) => t.hub === hubSlug);
  const otherTerms = terms.filter((t) => t.hub !== hubSlug);
  const dictionaryPreview = [...hubTerms, ...otherTerms].slice(0, limit);

  const hubPosts = posts.filter((p) => p.hub === hubSlug);
  const otherPosts = posts.filter((p) => p.hub !== hubSlug);
  const guidePreview = [...hubPosts, ...otherPosts].slice(0, limit);

  return { dictionaryPreview, guidePreview };
}

module.exports = {
  isConfigured,
  getDictionaryTerms,
  getDictionaryTermBySlug,
  getGuidePosts,
  getGuidePostBySlug,
  getActiveBanners,
  getHubContentPreview
};
