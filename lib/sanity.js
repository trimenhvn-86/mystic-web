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
      useCdn: true,
      token: process.env.SANITY_API_TOKEN || undefined
    })
  : null;

async function safeFetch(query, params = {}, fallback = []) {
  if (!isConfigured) return fallback;
  try {
    return await client.fetch(query, params);
  } catch (err) {
    console.error('Sanity fetch error:', err.message);
    return fallback;
  }
}

// ---- Dictionary (Từ điển huyền học) ----
async function getDictionaryTerms() {
  return safeFetch(
    `*[_type == "dictionaryTerm"] | order(title asc){ title, "slug": slug.current, shortDefinition, hub }`,
    {},
    []
  );
}

async function getDictionaryTermBySlug(slug) {
  return safeFetch(
    `*[_type == "dictionaryTerm" && slug.current == $slug][0]{
      title, "slug": slug.current, shortDefinition, origin, meaning, application, example, relatedTerms, hub
    }`,
    { slug },
    null
  );
}

// ---- Guide (Cẩm nang) ----
async function getGuidePosts() {
  return safeFetch(
    `*[_type == "article"] | order(publishedAt desc){
      title, "slug": slug.current, excerpt, hub, publishedAt,
      "featuredImageUrl": featuredImage.asset->url
    }`,
    {},
    []
  );
}

async function getGuidePostBySlug(slug) {
  return safeFetch(
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
  const [terms, posts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);

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
