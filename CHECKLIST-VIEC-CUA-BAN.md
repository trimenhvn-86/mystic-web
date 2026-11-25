# Việc của bạn (ngoài code) — SEO TriMenh

## Làm ngay hôm nay
1. Chạy `don-dep.bat` (xóa bản sao dự án bị lồng trong thư mục public), rồi chạy `capnhat.bat`.
2. Vercel: xóa biến `SANITY_BUILD_OFFLINE`. Rồi vào Settings → Domains: bấm Edit ở `www.trimenh.com` → chọn **Redirect to** `trimenh.com` (308), và `trimenh.com` là domain chính (không redirect). Sau đó Redeploy.
   Quan trọng: trang web đã chuyển sang dùng `https://trimenh.com` (không www) làm địa chỉ chuẩn. Đừng đổi qua lại nữa.
3. Search Console: dùng property **Domain** (hoặc `https://trimenh.com/`). Gửi sitemap `https://trimenh.com/sitemap.xml`.
4. Kiểm tra URL → "Yêu cầu lập chỉ mục" (tối đa ~10 trang/ngày), theo thứ tự:
   trang chủ, /cam-nang, /tu-dien, /tu-vi-hom-nay, /xem-ngay-tot,
   /cam-nang/tet-dinh-mui-2027, /cam-nang/nam-dinh-mui-2027,
   /cam-nang/lich-ngay-tot-thang-12-2026, /cam-nang/tu-vi-la-gi, /cam-nang/12-truc-la-gi.

## Tuần này
5. Đăng ký **Bing Webmaster Tools** (có thể nhập thẳng từ Search Console) và gửi sitemap.
6. Chạy **PageSpeed Insights** cho trang chủ và /xem-ngay-tot (mobile). Gửi lại điểm LCP/INP/CLS cho tôi nếu dưới "Tốt".
7. Đặt cảnh báo **UptimeRobot** cho 3 URL: /, /cam-nang/tu-vi-la-gi, /tu-vi-hom-nay.
8. Vercel → Settings → Environment Variables, thêm cho cron bài tự động (nếu muốn bật):
   - `GITHUB_TOKEN` (fine-grained, repo mystic-web, quyền Contents: Read and write)
   - `ANTHROPIC_API_KEY`
   - `CRON_SECRET` (chuỗi tự đặt)
   Cron chạy ngày 27 hằng tháng, tự đăng 3 bài cho tháng sau.

## Mạng xã hội / liên kết (dài hạn)
9. Tạo/đồng bộ Facebook, TikTok, Zalo OA, YouTube Shorts: đăng tử vi và tarot hằng ngày kèm link về trang tương ứng.
10. Xin vài liên kết từ blog, diễn đàn phong thủy, trang địa phương. Thêm link trang web vào mọi hồ sơ mạng xã hội.

## Theo dõi (4 tuần sau)
- Search Console → Lập chỉ mục → Trang: số "Đã lập chỉ mục" tăng; "Đã phát hiện – hiện chưa được lập chỉ mục" giảm từ 664.
- Hiệu suất: nhóm /tu-vi-hom-nay (hiển thị, vị trí), và số trang cẩm nang/từ điển có hiển thị.
