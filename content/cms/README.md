# Nội dung Cẩm nang & Từ điển (lưu bằng file, không cần Sanity)

- `articles/<slug>.json`: bài cẩm nang. Trường: title, slug, hub, excerpt, seoTitle, seoDescription, publishedAt, htmlContent (HTML sạch: h2 h3 p ul li strong).
- `terms/<slug>.json`: thuật ngữ. Trường: title, slug, hub, shortDefinition, origin, meaning, application, example, relatedTerms[].
- `"draft": true` trong file = chưa đăng.
- hub là một trong: lich-ngay-tot, than-so-hoc, menh-phong-thuy, tuoi-tuong-hop, tu-vi, tarot.

Thêm bài: (1) GitHub web > Add file > Upload files vào thư mục này, hoặc (2) nhập hàng loạt: `node scripts/import-articles.js tools/mau-bai-viet.csv`, hoặc (3) cron/PHP gọi GitHub API (lib/githubPublish.js).
Mỗi commit => Vercel tự build lại => bài lên web. Build sẽ báo lỗi rõ nếu file sai định dạng.
Chuyển từ Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID=13pf0iga SANITY_API_TOKEN=... node scripts/export-from-sanity.js` (sau khi Sanity reset quota ~30/11).
