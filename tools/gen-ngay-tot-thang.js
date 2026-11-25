/**
 * Tạo bài "Ngày tốt tháng M/YYYY" từ dữ liệu lịch của site (không cần AI).
 *   node tools/gen-ngay-tot-thang.js 12 2026
 * Ghi vào content/cms/articles/lich-ngay-tot-thang-M-YYYY.json
 */
const fs = require('fs');
const path = require('path');
const { buildLichThangData } = require('../lib/monthlyContentData');
const { convertSolar2Lunar } = require('../lib/lunar');

const mm = Number(process.argv[2]);
const yyyy = Number(process.argv[3]);
if (!mm || !yyyy) { console.error('Cách dùng: node tools/gen-ngay-tot-thang.js 12 2026'); process.exit(1); }
const d = buildLichThangData(mm, yyyy);
const pad = (n) => String(n).padStart(2, '0');
const url = (x) => `/xem-ngay-tot/ngay-${pad(x.dd)}-thang-${pad(x.mm)}-nam-${x.yyyy}`;
const km = (x) => `<li><a href="${url(x)}">${x.dd}/${x.mm}/${x.yyyy}</a> (${x.ten})</li>`;
const lunarOf = (x) => { const l = convertSolar2Lunar(x.dd, x.mm, x.yyyy); return `${l.day}/${l.month}${l.leap ? ' nhuận' : ''} âm lịch`; };

const html = `<h2>Tổng quan ngày tốt tháng ${mm}/${yyyy}</h2>
<p>Bạn đang tìm một ngày đẹp cho việc quan trọng trong tháng ${mm}/${yyyy}? Mình gom sẵn cho bạn ở đây. Tháng này có ${d.soNgayTrongThang} ngày, trong đó theo tra cứu của TriMenh có <strong>${d.tongSoNgayHoangDao} ngày Hoàng đạo</strong> và ${d.tongSoNgayHacDao} ngày Hắc đạo. Những ngày đẹp nhất bên dưới phù hợp cho các việc như khai trương, cưới hỏi, động thổ, nhập trạch.</p>
<h2>Những ngày đẹp nhất trong tháng</h2>
<ul>${d.ngayDepNhatThang.map((x) => `<li><strong><a href="${url(x)}">${x.thu}, ${x.dd}/${x.mm}/${x.yyyy}</a></strong> (${lunarOf(x)}). Giờ Hoàng đạo: ${x.gioHoangDao.join(', ')}.</li>`).join('')}</ul>
<h2>Ngày xuất hành theo Khổng Minh</h2>
<p>Một số ngày được xem là tốt để xuất hành, cầu tài:</p><ul>${d.ngayKhongMinhTot.map(km).join('')}</ul>
<p>Một số ngày nên cân nhắc khi đi xa hoặc cầu tài lớn:</p><ul>${d.ngayKhongMinhXau.map(km).join('')}</ul>
${d.tietKhiTrongThang && d.tietKhiTrongThang.length ? `<h2>Tiết khí trong tháng</h2><p>Trong tháng ${mm}/${yyyy} có các tiết khí: ${d.tietKhiTrongThang.join(', ')}. Xem thêm <a href="/cam-nang/24-tiet-khi">24 tiết khí là gì</a>.</p>` : ''}
<h2>Chọn ngày sao cho nhẹ nhàng?</h2>
<p>Nói thật, ngày đẹp chỉ là một phần. Đánh giá Hoàng đạo và Hắc đạo là đánh giá chung, chưa tách riêng từng công việc. Hãy chọn ngày thuận tiện cho cả nhà hoặc cả nhóm trước, rồi đối chiếu thêm tuổi và giờ tốt cho yên tâm. Xem chi tiết từng ngày tại <a href="/xem-ngay-tot">Xem ngày tốt</a>, giờ tốt tại <a href="/gio-hoang-dao">Giờ Hoàng đạo</a>, hoặc ngày cho việc cụ thể: <a href="/xem-ngay/khai-truong">khai trương</a>, <a href="/xem-ngay/cuoi-hoi">cưới hỏi</a>.</p>
<h2>Câu hỏi thường gặp</h2>
<h3>Ngày Hoàng đạo có phải ngày tốt cho mọi việc?</h3><p>Không hẳn. Đây là đánh giá chung; mỗi việc còn cần xét tuổi gia chủ và giờ.</p>
<h3>Nếu chỉ rảnh vào ngày Hắc đạo thì sao?</h3><p>Nhiều người chọn giờ Hoàng đạo trong ngày để bắt đầu việc quan trọng.</p>`;

// Cùng quy tắc đặt tên với cron bai-viet-thang để không bị trùng bài (cron chạy sau sẽ ghi đè đúng bài này)
const slug = `lich-ngay-tot-thang-${mm}-${yyyy}`;
const doc = {
  title: `Lịch Ngày Tốt Tháng ${mm}/${yyyy}`,
  slug, hub: 'lich-ngay-tot',
  excerpt: `Tháng ${mm}/${yyyy} có ${d.tongSoNgayHoangDao} ngày Hoàng đạo. Xem những ngày đẹp nhất, giờ Hoàng đạo và ngày xuất hành Khổng Minh.`,
  seoTitle: `Ngày Tốt Tháng ${mm}/${yyyy}: Ngày Hoàng Đạo Đẹp Nhất`.slice(0, 60),
  seoDescription: `Lịch ngày tốt tháng ${mm}/${yyyy}: ${d.tongSoNgayHoangDao} ngày Hoàng đạo, ngày đẹp nhất để khai trương, cưới hỏi, giờ Hoàng đạo và ngày xuất hành.`.slice(0, 155),
  publishedAt: new Date().toISOString(),
  htmlContent: html
};
fs.writeFileSync(path.join(__dirname, '..', 'content', 'cms', 'articles', slug + '.json'), JSON.stringify(doc, null, 2) + '\n');
console.log('Đã tạo', slug);
