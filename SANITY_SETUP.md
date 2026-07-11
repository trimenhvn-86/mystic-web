# Thiết lập Sanity CMS cho TriMenh

Sanity là CMS miễn phí (đủ dùng cho quy mô nhỏ-vừa) để bạn tự quản lý **Từ điển huyền học**, **Cẩm nang (blog)** và **Banner quảng cáo** — không cần biết code, có giao diện web để nhập/sửa nội dung.

---

## BƯỚC 1 — Tạo project Sanity

1. Cài Node.js nếu máy chưa có (https://nodejs.org, chọn bản LTS).
2. Mở Terminal/CMD, chạy:
   ```
   npm create sanity@latest
   ```
3. Trả lời các câu hỏi:
   - Đăng nhập/đăng ký tài khoản Sanity (miễn phí, dùng Google/GitHub cũng được)
   - Project name: `trimenh-cms` (hoặc tên bạn thích)
   - Dùng dataset mặc định: `production`
   - Chọn template: **Clean project with no predefined schemas**
   - Đồng ý cài TypeScript hoặc không đều được (chọn "No" cho đơn giản)

4. Sau khi xong, bạn sẽ có 1 project **riêng biệt** (không nằm trong code TriMenh) — đây là "phòng biên tập" của bạn.

---

## BƯỚC 2 — Thêm cấu trúc nội dung (Schema)

Trong project Sanity vừa tạo, mở thư mục `schemaTypes` (hoặc `schemas`), tạo 3 file sau:

**`dictionaryTerm.js`** (Từ điển):
```javascript
export default {
  name: 'dictionaryTerm',
  title: 'Từ điển',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tên thuật ngữ', type: 'string' },
    { name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title' } },
    { name: 'shortDefinition', title: 'Định nghĩa ngắn', type: 'text' },
    { name: 'origin', title: 'Nguồn gốc', type: 'text' },
    { name: 'meaning', title: 'Ý nghĩa', type: 'text' },
    { name: 'application', title: 'Ứng dụng', type: 'text' },
    { name: 'example', title: 'Ví dụ', type: 'text' },
    { name: 'relatedTerms', title: 'Thuật ngữ liên quan (nhập đúng slug)', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'hub', title: 'Thuộc Hub nào', type: 'string',
      options: {
        list: [
          { title: 'Lịch & Ngày Tốt', value: 'lich-ngay-tot' },
          { title: 'Thần Số Học', value: 'than-so-hoc-hub' },
          { title: 'Mệnh & Phong Thủy', value: 'menh-phong-thuy' },
          { title: 'Tuổi & Tương Hợp', value: 'tuoi-tuong-hop' },
          { title: 'Tử Vi', value: 'tu-vi' },
          { title: 'Tarot', value: 'tarot' }
        ]
      }
    }
  ]
};
```

**`article.js`** (Cẩm nang) — đã cập nhật thêm ô nhập HTML sạch, ảnh đại diện, và SEO override:
```javascript
export default {
  name: 'article',
  title: 'Cẩm nang',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tiêu đề', type: 'string' },
    { name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', title: 'Tóm tắt ngắn (hiện ở danh sách + meta description mặc định)', type: 'text' },
    {
      name: 'featuredImage', title: 'Ảnh đại diện', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Mô tả ảnh (alt text)', type: 'string' }]
    },
    {
      name: 'htmlContent',
      title: 'Nội dung HTML (dán HTML sạch từ Claude/ChatGPT vào đây)',
      type: 'text',
      rows: 30,
      description: 'Dán nguyên khối HTML (h2, p, ul, img...) — web sẽ render trực tiếp, không cần định dạng lại.'
    },
    { name: 'seoTitle', title: 'SEO Title (để trống sẽ dùng Tiêu đề)', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description (để trống sẽ dùng Tóm tắt ngắn)', type: 'text' },
    { name: 'publishedAt', title: 'Ngày đăng', type: 'datetime' },
    {
      name: 'hub', title: 'Thuộc Hub nào', type: 'string',
      options: {
        list: [
          { title: 'Lịch & Ngày Tốt', value: 'lich-ngay-tot' },
          { title: 'Thần Số Học', value: 'than-so-hoc' },
          { title: 'Mệnh & Phong Thủy', value: 'menh-phong-thuy' },
          { title: 'Tuổi & Tương Hợp', value: 'tuoi-tuong-hop' },
          { title: 'Tử Vi', value: 'tu-vi' },
          { title: 'Tarot', value: 'tarot' }
        ]
      }
    }
  ]
};
```

**`banner.js`** (Banner quảng cáo):
```javascript
export default {
  name: 'banner',
  title: 'Banner quảng cáo',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tên banner (nội bộ)', type: 'string' },
    { name: 'image', title: 'Hình ảnh', type: 'image' },
    { name: 'linkUrl', title: 'Link khi bấm vào', type: 'url' },
    { name: 'active', title: 'Đang hiển thị?', type: 'boolean', initialValue: true },
    {
      name: 'placement', title: 'Vị trí hiển thị', type: 'string',
      options: { list: [{ title: 'Trang chủ', value: 'homepage' }, { title: 'Trang Hub', value: 'hub' }] }
    }
  ]
};
```

Sau đó vào file `schemaTypes/index.js`, import và khai báo cả 3 loại trên trong mảng `types`.

> **Lưu ý về giá trị "hub":** field `hub` ở trên dùng đúng 6 giá trị URL thật của site. Riêng Thần Số Học dùng giá trị `than-so-hoc` (không có "-hub") dù trang Hub nằm ở địa chỉ `/than-so-hoc-hub` — lý do là `/than-so-hoc` đã là trang công cụ, code web tự map 2 giá trị này với nhau nên bạn không cần quan tâm, chỉ cần chọn đúng tên hiển thị trong dropdown.
>
> Nếu schema Sanity của bạn hiện có thêm các lựa chọn khác (ví dụ "Bát Tự", "Nhân Tướng") mà chưa thấy trong danh sách trên — đó là các Hub **chưa có trang thật trên web**. Bài đăng gắn vào các hub đó sẽ không hiển thị ở đâu cho tới khi trang Hub tương ứng được xây dựng.

**Ảnh (featuredImage):** ảnh tải lên Sanity được phục vụ qua CDN riêng của Sanity (`cdn.sanity.io`) — domain này đã được thêm sẵn vào cấu hình web (`next.config.js`), không cần chỉnh gì thêm.

---

## BƯỚC 3 — Đăng nội dung lên Studio online (để nhập liệu qua web, không cần mở code)

Trong thư mục project Sanity, chạy:
```
npx sanity deploy
```
Nó sẽ hỏi 1 tên miền phụ (VD: `trimenh`), sau đó bạn được 1 link dạng:
```
https://trimenh.sanity.studio
```
→ Đây là trang quản trị để bạn (hoặc bất kỳ ai bạn cấp quyền) đăng nhập và **nhập nội dung trực tiếp qua trình duyệt**, giống WordPress.

---

## BƯỚC 4 — Lấy Project ID và kết nối vào TriMenh

1. Vào https://sanity.io/manage → chọn project vừa tạo → copy **Project ID** (dạng chuỗi random 8 ký tự).
2. Vào project TriMenh trên **Vercel** → Settings → Environment Variables → thêm:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID = <project id vừa copy>
   NEXT_PUBLIC_SANITY_DATASET = production
   ```
3. Trong sanity.io/manage → project → **API → CORS Origins** → bấm "Add CORS origin" → nhập `https://trimenh.com` (và cả `https://*.vercel.app` nếu muốn test trên domain tạm) → tick "Allow credentials" → Save. (Bước này bắt buộc, nếu bỏ qua web sẽ không đọc được dữ liệu từ Sanity.)
4. Redeploy lại project trên Vercel (Deployments → Redeploy) để nhận biến môi trường mới.

---

## BƯỚC 5 — Bắt đầu nhập nội dung

Vào link Studio (`https://trimenh.sanity.studio`) → đăng nhập → bấm "+" tạo tài liệu mới:
- Chọn **Từ điển** → nhập thuật ngữ (VD: "Can Chi", slug tự sinh) → Publish
- Chọn **Cẩm nang** → viết bài → Publish
- Chọn **Banner quảng cáo** → tải ảnh + link → Publish

Sau khi Publish, trong vòng tối đa 1 giờ (thời gian cache ISR) nội dung sẽ tự xuất hiện trên TriMenh.com — không cần deploy lại code.

---

## Lưu ý

- Nếu bạn không tự làm được bước cài Node.js/chạy lệnh terminal, có thể nhờ 1 bạn dev làm hộ đúng 5 bước trên (mất khoảng 30-60 phút), sau đó việc **nhập nội dung hàng ngày bạn hoàn toàn tự làm được** qua giao diện Studio, không cần dev nữa.
- Gói miễn phí Sanity đủ dùng tới hàng chục nghìn tài liệu/tháng — dư sức cho quy mô ~100 thuật ngữ + ~50 bài cẩm nang theo roadmap ban đầu.
