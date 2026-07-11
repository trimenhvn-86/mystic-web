# TriMenh.com — Nền tảng tra cứu vận trình, phong thủy, thần số học

Bản cập nhật theo tài liệu giao dev mới nhất. **8/8 tool Giai đoạn 1 (MVP) đã hoàn thành và build thành công (264 trang tĩnh).**

---

## 1. TÌNH TRẠNG HIỆN TẠI

| # | Tool | Trạng thái | URL |
|---|---|---|---|
| 1 | Đổi lịch âm dương | ✅ Xong | `/doi-lich-am-duong` |
| 2 | Xem ngày tốt | ✅ Xong | `/xem-ngay-tot` |
| 3 | Giờ hoàng đạo | ✅ Xong | `/gio-hoang-dao` |
| 4 | Mệnh ngũ hành | ✅ Xong | `/{năm}-menh-gi` |
| 5 | Thần số học | ✅ Xong | `/than-so-hoc` |
| 6 | Con số may mắn | ✅ Xong | `/con-so-may-man` |
| 7 | Tuổi hợp | ✅ Xong | `/{năm}-hop-tuoi-nao` |
| 8 | Tử vi hôm nay | ✅ Xong | `/tu-vi-hom-nay` |

Tất cả đã dùng thuật toán tính toán thật (không phải dữ liệu giả), đã kiểm tra round-trip chuyển đổi lịch và đối chiếu với dữ kiện thực tế (Tết 2026 = 17/2, năm 1993 = Quý Dậu, năm 2000 = Canh Thìn...).

## 2. THAY ĐỔI SO VỚI BẢN TRƯỚC (nếu bạn đã cài bản HuyềnSố cũ)

- Đổi brand: `HuyềnSố` → **TriMenh**
- Đổi cấu trúc thư mục nội dung: `data/*.json` → `content/{numerology,phong-thuy,lunar,zodiac}/...` — đúng chuẩn tài liệu để dễ version hóa từng mảng nội dung
- Đổi URL Thần số học: `/than-so-hoc/so-8` → `/than-so-hoc/so-chu-dao-8`
- Câu loading đổi theo đúng nguyên tắc "không nhắc AI ra ngoài" trong tài liệu (VD: "Hệ thống Tri Mệnh đang phân tích...")
- **Nếu bản cũ chưa deploy thật thì không cần lo migrate gì — cài thẳng bản mới này.**

## 3. CÁC BƯỚC DEPLOY

1. Tạo repo GitHub mới, upload toàn bộ nội dung file zip này (giữ đúng cấu trúc thư mục).
2. Vào vercel.com → đăng nhập GitHub → Add New Project → chọn repo → Deploy.
3. Thêm biến môi trường `SITE_URL=https://trimenh.com` trong Vercel Settings.
4. Gắn domain `trimenh.com` thật vào Vercel (Settings → Domains).
5. Khai báo domain vào Google Search Console, nộp `sitemap.xml`.

---

## 4. ⚠️ VIỆC CẦN LÀM TRƯỚC KHI CHẠY THẬT

1. **Kiểm duyệt nội dung huyền học** — các bảng: Nạp Âm Ngũ Hành (`content/phong-thuy/menh/nap-am.json`), Tam hợp/Tứ hành xung (`content/phong-thuy/tuoi-hop/`), Giờ Hoàng Đạo (`content/lunar/gio-hoang-dao/`), Trực/Sao (`lib/dayQuality.js`) đều là kiến thức truyền thống phổ biến — **nên có người chuyên môn phong thủy kiểm tra lại** trước khi công khai quy mô lớn.
2. **AdSense**: thay `components/AdSlot.js` bằng mã thật khi có tài khoản, đọc chính sách "ad refresh" trước khi áp dụng chiến lược đổi-tab.
3. **Tử vi hôm nay** hiện dùng pool câu cố định xoay vòng theo ngày (đủ dùng cho MVP, KHÔNG gọi AI runtime — đúng nguyên tắc Rule Engine + Knowledge Base trong tài liệu). Khi cần đa dạng nội dung hơn, chỉ cần bổ sung thêm câu vào `content/zodiac/tu-vi-hom-nay/mau-cau.json`, không cần sửa code.
4. Slug 12 Con Giáp dùng bảng tường minh tại `lib/chiSlug.js` để tránh trùng URL giữa "Tý" và "Tỵ" khi bỏ dấu — nếu đổi tên miền/slug, sửa ở đây.

---

## 5. KẾ HOẠCH TRIỂN KHAI TIẾP THEO (theo đúng roadmap tài liệu)

### Giai đoạn 2 — Mở rộng phong thủy (Tháng 3-4)

| # | Tool | Ghi chú kỹ thuật | Độ khó |
|---|---|---|---|
| 9 | Màu sắc hợp mệnh | Tái dùng `lib/nguHanh.js` — đã có sẵn field `mauHop`, chỉ cần làm trang riêng `/{năm}-hop-mau-gi` | Rất thấp |
| 10 | Xem tuổi kết hôn | Cần lib đối chiếu 2 tuổi (mở rộng `lib/tuoiHop.js` cho 2 input) | Thấp |
| 11 | Xem tuổi làm ăn | Tương tự tuổi kết hôn, đổi nội dung luận giải | Thấp |
| 12 | Hướng nhà hợp tuổi | Cần thêm bảng Đông/Tây tứ trạch theo Cung mệnh (Kiền/Khôn/Cấn/Đoài...) | Trung bình |
| 13 | Sim phong thủy | Cần engine tính tổng điểm dãy số + đối chiếu ngũ hành số (đã có `HA_DO` trong `lib/luckyNumber.js`) | Trung bình |
| 14 | Biển số xe phong thủy | Logic tương tự Sim phong thủy, tái dùng phần lớn code | Thấp (làm sau #13) |

**Việc quan trọng nhất giai đoạn này**: triển khai bảng `users`, `profiles`, `profile_calculations` — vì tool #10, #11 cần lưu 2 hồ sơ để so sánh, đây là lúc hệ thống cần tài khoản/hồ sơ thật (trước đó mọi tool đều stateless).

### Giai đoạn 3 — Viral & retention (Tháng 5-6)

| # | Tool | Ghi chú kỹ thuật | Độ khó |
|---|---|---|---|
| 15 | Đặt tên cho con | Cần Generator Engine lọc tên theo ngũ hành + Pythagoras (nền có sẵn `lib/numerology.js`, `lib/nguHanh.js`) + cần **bộ dữ liệu tên** (tốn công nhất, không phải code) | Cao (do cần data) |
| 16 | Ý nghĩa tên | Tái dùng bộ dữ liệu tên của #15 | Thấp (làm sau #15) |
| 17 | Tarot hôm nay | Cần bộ ảnh + nội dung 78 lá bài (data-heavy), hiệu ứng lật bài 3D CSS | Trung bình |
| 18 | Cung hoàng đạo hôm nay | Tương tự Tử vi hôm nay nhưng 12 cung phương Tây — tái dùng cơ chế xoay vòng deterministic của `lib/tuViHomNay.js` | Thấp |
| 19 | Bói tình yêu / độ hợp nhau | Kết hợp Thần số học + Tuổi hợp 2 người | Trung bình |
| 20 | Rút 1 lá Oracle | Tương tự Tarot nhưng bộ bài đơn giản hơn | Thấp (làm sau #17) |

**Việc quan trọng nhất giai đoạn này**: triển khai `daily_snapshots` — để mỗi user quay lại mỗi ngày có kết quả mới (đã có sẵn cơ chế deterministic-by-date ở Tử vi hôm nay, chỉ cần gắn thêm `user_id` khi có tài khoản).

---

## 6. GỢI Ý THỨ TỰ LÀM TIẾP (thực tế, dựa trên code đã có)

Nhắn mình theo thứ tự này để tận dụng tối đa code đã dựng sẵn, tránh làm lại:

1. **Màu sắc hợp mệnh** (gần như free — chỉ cần 1 trang mới)
2. **Cung hoàng đạo hôm nay** (tái dùng engine Tử vi hôm nay)
3. **Sim / Biển số phong thủy** (tái dùng Hà Đồ số đã có)
4. Từ đây mới cần bàn đến hệ thống tài khoản (`users`, `profiles`) để làm tuổi kết hôn/làm ăn và daily snapshot cá nhân hóa.
