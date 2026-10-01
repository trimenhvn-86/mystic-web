/**
 * pages/api/cron/bai-viet-thang.js
 * CHẠY TỰ ĐỘNG HÀNG THÁNG (qua Vercel Cron, xem vercel.json) - KHÔNG gọi tay trừ khi test.
 *
 * Luồng: tính dữ liệu tháng tới -> viết 3 bài bằng Claude -> đăng lên Sanity (publish thẳng,
 * không qua Draft) -> làm mới (revalidate) các trang liên quan.
 *
 * Bảo vệ: Vercel tự động gửi header "Authorization: Bearer $CRON_SECRET" khi gọi cron thật -
 * handler kiểm tra đúng secret này trước khi chạy, chặn người ngoài gọi tay endpoint.
 *
 * Biến môi trường cần có (thêm vào Vercel, KHÁC với các biến đã có từ trước):
 *   CRON_SECRET          - chuỗi bất kỳ tự đặt, Vercel tự gửi kèm khi gọi cron thật
 *   ANTHROPIC_API_KEY    - key Claude riêng cho việc viết bài tự động
 *   SANITY_WRITE_TOKEN   - token Sanity quyền Editor (khác SANITY_API_TOKEN quyền Viewer đang dùng để đọc)
 */
import { buildTuViThangData, buildLichThangData, buildLaBaiThangData } from '../../../lib/monthlyContentData';
import { getVietnamNow } from '../../../lib/vnDate';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[/,.]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!response.ok) {
    throw new Error(`Claude API lỗi ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text?.trim() || '';
}

async function publishToSanity(doc, docId) {
  // Du an nay dung model Content Releases moi cua Sanity - khong con action
  // "sanity.action.document.publish" don gian kieu cu. Cach dung: tao THANG document
  // da publish (id KHONG co tien to "drafts.") bang 1 action "create" duy nhat.
  // Luu y quan trong: tham so dung la "document" (khong phai "attributes").
  const actions = [
    {
      actionType: 'sanity.action.document.create',
      document: { ...doc, _id: docId },
      ifExists: 'ignore' // neu da ton tai (vi du chay lai cung thang de test) thi bo qua, khong loi
    }
  ];
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/actions/${SANITY_DATASET}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}`
    },
    body: JSON.stringify({ actions })
  });
  if (!response.ok) {
    throw new Error(`Sanity Actions API lỗi ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

const PROMPTS = {
  tuVi: {
    system: `Bạn là biên tập viên chuyên mục Tử vi - Phong thủy của TriMenh.com, viết theo phong cách báo chí đời sống Việt Nam (giống VnExpress) - ngắn gọn, dễ đọc, có điểm nhấn rõ ràng ngay từ đầu bài.
QUAN TRỌNG NHẤT: Toàn bộ số liệu, xếp hạng, mô tả vận trình từng con giáp PHẢI lấy đúng từ dữ liệu JSON cung cấp - KHÔNG tự bịa thêm hay đổi thứ tự xếp hạng.
CẤU TRÚC: (1) Mở bài nêu ngay 1-2 con giáp may mắn nhất + điểm nổi bật tháng. (2) Tổng quan vận trình tháng. (3) Top con giáp may mắn nhất (hạng 1-4). (4) Con giáp cần thận trọng (hạng 9-12), giọng nhẹ nhàng kèm hướng khắc phục. (5) Ngày tốt nên lưu ý (2-3 ngày từ "ngayTotNhat"). (6) Câu hỏi thường gặp (3 câu, dùng h3). (7) Dẫn link tới "urlChiTiet" tự nhiên trong câu văn.
GIỌNG VĂN: câu đầu "giật" chú ý, đa dạng độ dài câu, HTML sạch (chỉ h2 h3 p ul li strong, KHÔNG Markdown), kết bài nhắc ngắn mang tính tham khảo. Độ dài 1500-2000 từ. Chỉ trả về HTML thuần bắt đầu bằng h2, không lời dẫn.`,
    buildUser: (data) => `Viết bài "Vận May 12 Con Giáp Tháng ${data.mm}/${data.yyyy}: Con giáp nào may mắn nhất?" dựa đúng theo dữ liệu sau:\n\n${JSON.stringify(data)}`,
    hub: 'tu-vi',
    titlePrefix: `Vận May 12 Con Giáp Tháng`
  },
  lich: {
    system: `Bạn là biên tập viên chuyên mục Lịch Vạn Niên của TriMenh.com, viết theo phong cách báo chí đời sống Việt Nam - thực tế, dễ áp dụng, không mê tín hóa quá mức.
QUAN TRỌNG NHẤT: Số liệu (ngày tốt, giờ Hoàng đạo, ngày Khổng Minh, tiết khí) PHẢI lấy đúng từ JSON cung cấp - không tự bịa.
TRUNG THỰC VỀ GIỚI HẠN: dữ liệu có trường "luuY" nói rõ hệ thống đánh giá ngày tốt theo Hoàng đạo/Hắc đạo CHUNG cho mọi việc, CHƯA phân biệt riêng từng việc. Viết đúng theo hướng "ngày Hoàng đạo, thường được xem là thuận lợi cho các việc như..." - KHÔNG viết như thể có bảng tính riêng cho từng việc.
CẤU TRÚC: (1) Mở bài nêu tổng số ngày Hoàng đạo + 1-2 ngày đẹp nhất. (2) Tổng quan lịch tháng. (3) Những ngày đẹp nhất để làm việc lớn (6 ngày từ "ngayDepNhatThang" kèm giờ Hoàng đạo). (4) Ngày Khổng Minh đáng chú ý. (5) Tiết khí trong tháng (nếu có). (6) Câu hỏi thường gặp (3 câu, h3). (7) Dẫn link tới "urlChiTiet".
HTML sạch (h2 h3 p ul li strong, KHÔNG Markdown). Độ dài 1200-1800 từ. Chỉ trả về HTML thuần bắt đầu bằng h2.`,
    buildUser: (data) => `Viết bài "Lịch Ngày Tốt Tháng ${data.mm}/${data.yyyy}: Ngày Nào Đẹp Nhất Để Làm Việc Lớn?" dựa đúng theo dữ liệu sau:\n\n${JSON.stringify(data)}`,
    hub: 'lich-ngay-tot',
    titlePrefix: `Lịch Ngày Tốt Tháng`
  },
  tarot: {
    system: `Bạn là biên tập viên Tarot của TriMenh.com. Mỗi tháng, hệ thống chọn 1 lá bài đại diện năng lượng chung cả tháng (thuật toán xác định, giống nhau cho mọi người xem).
QUAN TRỌNG: Tên lá, xuôi/ngược, ý nghĩa PHẢI lấy đúng theo JSON - không tự đổi hay bịa thêm ý nghĩa ngoài dữ liệu.
CẤU TRÚC: (1) Mở bài giới thiệu lá bài + ấn tượng đầu. (2) Ý nghĩa tổng quan (dựa "yNghiaTongQuan", "tuKhoa"). (3) Ảnh hưởng tình yêu/công việc/tài chính - được phép suy luận hợp lý từ ý nghĩa tổng quan. (4) Lời khuyên hành động trong tháng. (5) Câu hỏi thường gặp (3 câu, h3). (6) Dẫn link tới "urlChiTiet".
Giọng huyền bí nhưng gần gũi. HTML sạch (h2 h3 p ul li strong, KHÔNG Markdown). Kết bài nhắc ngắn: mang tính chiêm nghiệm. Độ dài 1000-1500 từ. Chỉ trả về HTML thuần bắt đầu bằng h2.`,
    buildUser: (data) => `Viết bài "Lá Bài Tarot Của Tháng ${data.mm}/${data.yyyy}: ${data.tenLa}" dựa đúng theo dữ liệu sau:\n\n${JSON.stringify(data)}`,
    hub: 'tarot',
    titlePrefix: `Lá Bài Tarot Của Tháng`
  }
};

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Không có quyền chạy cron này' });
  }

  const today = getVietnamNow();
  let mm = today.getMonth() + 2;
  let yyyy = today.getFullYear();
  if (mm > 12) { mm = 1; yyyy += 1; }

  const dataBuilders = {
    tuVi: buildTuViThangData(mm, yyyy),
    lich: buildLichThangData(mm, yyyy),
    tarot: buildLaBaiThangData(mm, yyyy)
  };

  const results = [];
  const revalidatePaths = new Set(['/', '/cam-nang']);

  for (const key of ['tuVi', 'lich', 'tarot']) {
    try {
      const data = dataBuilders[key];
      const prompt = PROMPTS[key];
      const htmlContent = await callClaude(prompt.system, prompt.buildUser(data));

      const title = key === 'tarot'
        ? `${prompt.titlePrefix} ${mm}/${yyyy}: ${data.tenLa}`
        : `${prompt.titlePrefix} ${mm}/${yyyy}`;
      const slug = slugify(title.replace(/[:?]/g, ''));
      const docId = `article-${slug}`;

      const doc = {
        _type: 'article',
        title,
        slug: { _type: 'slug', current: slug },
        excerpt: htmlContent.replace(/<[^>]+>/g, '').slice(0, 155),
        htmlContent,
        hub: prompt.hub,
        seoTitle: title.slice(0, 60),
        seoDescription: htmlContent.replace(/<[^>]+>/g, '').slice(0, 155),
        publishedAt: new Date().toISOString()
      };

      await publishToSanity(doc, docId);
      results.push({ key, slug, ok: true });

      revalidatePaths.add(`/cam-nang/${slug}`);
      revalidatePaths.add(`/${prompt.hub}`);
    } catch (err) {
      results.push({ key, ok: false, error: err.message });
    }
  }

  const revalidateResults = [];
  for (const path of revalidatePaths) {
    try {
      await res.revalidate(path);
      revalidateResults.push({ path, ok: true });
    } catch (err) {
      revalidateResults.push({ path, ok: false, error: err.message });
    }
  }

  return res.status(200).json({ mm, yyyy, articles: results, revalidate: revalidateResults });
}
