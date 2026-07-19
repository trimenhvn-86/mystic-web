# Nhật Ký Làm Việc — TriMenh.com

## Ngày làm việc: hôm nay

---

## 1. Sự cố kỹ thuật đã xử lý
- Sandbox làm việc bị reset giữa phiên → đã khôi phục lại đúng bằng cách nhận file zip mới nhất bạn upload lại
- Xác nhận file zip đúng là bản mới nhất (kiểm tra qua các file đặc trưng: `TarotHubExtras.js`, `trai-bai-3-la`, `xem-ngay`, giá trị `revalidate`)

---

## 2. Canonical Tag — sửa rủi ro trùng lặp SEO

**Vấn đề phát hiện:** Toàn bộ site (~57 trang, hàng trăm/nghìn URL programmatic) **không có canonical tag nào** — rủi ro thật với site có nhiều trang tự sinh (theo ngày, theo năm sinh...).

**Đã sửa:** Thêm 1 chỗ duy nhất trong `pages/_app.js` — tự động tạo canonical tag đúng cho **mọi trang** dựa theo URL thực tế (loại bỏ query string), không cần sửa từng trang riêng lẻ.

---

## 3. Breadcrumb — rà soát và bổ sung 46 trang

**Phát hiện quan trọng:** Ngay cả 7 trang chi tiết của Hub Lịch & Ngày Tốt (tưởng đã xong từ trước) cũng **chưa có breadcrumb**, chỉ trang form là có.

**Đã tạo:** Component `components/Breadcrumb.js` dùng chung toàn site — kèm theo **JSON-LD BreadcrumbList schema** giúp Google hiểu đúng cấu trúc phân cấp từng trang.

**Đã áp dụng cho 46 trang**, chia theo Hub:

| Hub | Số trang thêm breadcrumb |
|---|---|
| Lịch & Ngày Tốt (7 trang chi tiết còn thiếu) | 7 |
| Mệnh & Phong Thủy (4 tool + 1 chi tiết + 3 nhánh năm) | 8 |
| Tuổi & Tương Hợp (4 tool + 3 chi tiết + 3 khái niệm) | 10 |
| Tử Vi (3 tool + 3 chi tiết con giáp) | 6 |
| Tarot (bộ bài, 4 tool, trải bài) | 8 |
| Cẩm nang, Từ điển, Tìm kiếm, Giới thiệu, Liên hệ | 7 |

**Đã sửa thêm:** 2 trang từng tự viết breadcrumb tay bị thiếu chữ "Trang chủ" ở đầu (`tarot/[slug].js`, `than-so-hoc/[so].js`) — đồng bộ lại bằng component chuẩn.

---

## 4. Dọn link chéo giữa các Hub (quan trọng nhất)

**Nguyên tắc chốt:** Tool trong cùng 1 Hub thì interlink tự do với nhau. Tool ở Hub này **không** được link thẳng sang tool cụ thể ở Hub khác. Chỉ các trang Hub (pillar) mới được phép link qua lại với nhau.

**Đã tìm và xóa link chéo tại:**
- `MauSoHomNay` component (hiện trên trang Xem ngày tốt) → từng link sang `/than-so-hoc`
- `TuViDayDashboard`, `TuViWeekDashboard`, `TuViMonthDashboard` → từng link sang Xem ngày tốt, Giờ hoàng đạo, Đổi lịch âm, Can Chi, Ngày Hoàng đạo, Tuổi hợp (nhiều nhất, 5-6 link/file)
- `than-so-hoc/index.js` (cả 2 trạng thái form và kết quả) → từng link sang Xem ngày tốt, Tử vi hôm nay
- `so-sanh-tuoi/index.js` → từng link sang Mệnh Ngũ hành
- `xem-tuoi-ket-hon`, `xem-tuoi-lam-an` (cả form và chi tiết) → từng link sang Xem ngày tốt

**Đã viết:** 1 script Python tự động quét toàn bộ `pages/` và đối chiếu từng `href` với đúng Hub sở hữu, xác nhận **0 vi phạm còn sót** sau khi sửa.

---

## 5. Gọn Footer
Bỏ banner riêng "Liên hệ hợp tác quảng cáo" (hiện ở mọi trang, dư thừa vì site chưa có ads thật) — chỉ giữ đúng 1 link "Liên hệ" bình thường đã có sẵn trong Footer.

---

## Trạng thái hiện tại
- 6/6 Hub hoàn thiện tool, internal link nội bộ đầy đủ, không còn link chéo Hub
- Toàn site có canonical tag + breadcrumb + BreadcrumbList schema
- ISR revalidate đã tối ưu (giảm ISR Writes để không lặp lại sự cố Vercel bị tạm dừng)
- Google Analytics đã cài, có theo dõi lượt dùng cho 5 tool "ẩn" (không đổi URL)

## Việc còn đang dang dở / cần bàn tiếp
- Nội dung Từ điển + Cẩm nang: sẽ nhập dần qua content bot (DeepSeek + Sanity), đã có sẵn 3 file code mẫu (`1-deepseek-api.js`, `2-sanity-publish.js`, `3-internal-link-and-check.js`) và API `/api/revalidate` để bot gọi sau khi đăng bài
- 78 trang chi tiết Tarot dạng "bách khoa" (theo tài liệu feedback Tarot) — chưa làm, cần khối lượng nội dung lớn
- Tử vi theo "ngày mai" / "theo năm" — chưa xây (cần mở rộng route mới)
