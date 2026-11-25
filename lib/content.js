/**
 * lib/content.js
 * Nguồn nội dung của Cẩm nang và Từ điển.
 *
 * MẶC ĐỊNH: đọc từ các file trong content/cms/ (được gom lúc build thành lib/cmsData.generated.json).
 * Không phụ thuộc dịch vụ bên ngoài => không có hạn mức, không có lỗi mạng, không có cache 404 do CMS lỗi.
 *
 * Muốn dùng lại Sanity (không khuyến nghị): đặt biến môi trường CONTENT_SOURCE=sanity.
 */
if (process.env.CONTENT_SOURCE === 'sanity') {
  module.exports = require('./sanity');
} else {
  const data = require('./cmsData.generated.json');

  // Trong bài viết chỉ để 1 thẻ H1 (tiêu đề trang); H1 nằm trong nội dung hạ xuống H2
  function demoteH1(html) {
    return String(html || '').replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  }

  function listFields(a) {
    const { htmlContent, ...rest } = a; // eslint-disable-line no-unused-vars
    return rest;
  }

  const isConfigured = true;

  async function getGuidePosts() {
    return data.articles.map(listFields);
  }

  async function getGuidePostBySlug(slug) {
    const a = data.articles.find((x) => x.slug === slug);
    if (!a) return null;
    return { ...a, htmlContent: demoteH1(a.htmlContent), body: null };
  }

  async function getDictionaryTerms() {
    return data.terms.map(({ title, slug, shortDefinition, hub, updatedAt }) => ({ title, slug, shortDefinition, hub, updatedAt }));
  }

  async function getDictionaryTermBySlug(slug) {
    return data.terms.find((t) => t.slug === slug) || null;
  }

  async function getActiveBanners() {
    return [];
  }

  async function getHubContentPreview(hubSlug, limit = 4) {
    const terms = await getDictionaryTerms();
    const posts = await getGuidePosts();
    const pick = (arr) => [...arr.filter((x) => x.hub === hubSlug), ...arr.filter((x) => x.hub !== hubSlug)].slice(0, limit);
    return { dictionaryPreview: pick(terms), guidePreview: pick(posts) };
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
}
