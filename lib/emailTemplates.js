import { SITE, link } from './emailToken';
import { convertSolar2Lunar, getTietKhi } from './lunar';
import { getTruc, getSuggestedActivities } from './dayQuality';
import { getGioHoangDao } from './gioHoangDao';
import { getBestAndWorstDays } from './periodRating';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Soạn nội dung dạng chữ thường: dòng trống tách đoạn; "## " là tiêu đề nhỏ; "- " là gạch đầu dòng; [chữ](link) là liên kết. */
export function textToHtml(text) {
  const inline = (s) => esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#C42B1C">$1</a>');
  return String(text).trim().split(/\n{2,}/).map((block) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^- /.test(l))) {
      return `<ul style="margin:0 0 16px;padding-left:20px">${lines.map((l) => `<li style="margin:0 0 6px">${inline(l.slice(2))}</li>`).join('')}</ul>`;
    }
    if (/^## /.test(block)) return `<h2 style="font-size:18px;margin:24px 0 8px;color:#1B1B24">${inline(block.slice(3))}</h2>`;
    return `<p style="margin:0 0 16px">${lines.map(inline).join('<br>')}</p>`;
  }).join('\n');
}
export const textOnly = (text) => String(text).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1: $2').replace(/^## /gm, '');

export function wrap({ bodyHtml, unsubscribeUrl, preheader = '' }) {
  return `<!doctype html><html lang="vi"><body style="margin:0;background:#F7F6F1;font-family:Arial,Helvetica,sans-serif;color:#1B1B24">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #D3CFC0;border-radius:6px">
<tr><td style="background:#C42B1C;height:8px;border-radius:6px 6px 0 0;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:22px 28px 0;font-size:22px;font-weight:bold">Tri<span style="color:#C42B1C">Menh</span></td></tr>
<tr><td style="padding:16px 28px 8px;font-size:16px;line-height:1.7">${bodyHtml}</td></tr>
<tr><td style="padding:16px 28px 26px;font-size:12px;line-height:1.6;color:#55555F;border-top:1px solid #EDEBE2">
Bạn nhận email này vì đã đăng ký nhận lịch ngày tốt tại ${SITE().replace('https://', '')}. Nội dung mang tính tham khảo, chiêm nghiệm.<br>
${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color:#55555F">Hủy nhận email</a>` : ''}</td></tr>
</table></td></tr></table></body></html>`;
}

const btn = (href, label) => `<p style="margin:24px 0"><a href="${href}" style="background:#C42B1C;color:#fff;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:6px;display:inline-block">${label}</a></p>`;

export function confirmEmail(email) {
  const url = link('confirm', email);
  return {
    subject: 'Xác nhận đăng ký nhận lịch ngày tốt TriMenh',
    html: wrap({ bodyHtml: `<p>Chào bạn,</p><p>Bạn vừa đăng ký nhận lịch ngày tốt hằng tháng từ TriMenh. Bấm nút dưới đây để xác nhận.</p>${btn(url, 'Xác nhận đăng ký')}<p style="font-size:14px;color:#55555F">Nếu bạn không đăng ký, cứ bỏ qua email này, bạn sẽ không nhận thêm gì.</p>`, preheader: 'Bấm để xác nhận đăng ký' }),
    text: `Bạn vừa đăng ký nhận lịch ngày tốt từ TriMenh. Xác nhận tại: ${url}\nNếu không phải bạn, hãy bỏ qua email này.`
  };
}

export function welcomeEmail(email) {
  const unsub = link('unsubscribe', email);
  const body = `Cảm ơn bạn đã đăng ký. Mỗi tháng, trước ngày 1, bạn sẽ nhận một email gồm:

- Những ngày Hoàng đạo đẹp nhất tháng và giờ đẹp trong ngày
- Ngày nên cân nhắc hơn (Tam Nương, Nguyệt kỵ)
- Lá bài tarot của tháng
- Một bài cẩm nang đáng đọc

Trong lúc chờ, bạn có thể thử ngay:

- [Xem ngày tốt cho việc của bạn](${SITE()}/xem-ngay-tot)
- [Tra mệnh theo năm sinh](${SITE()}/menh-ngu-hanh)
- [Tử vi hôm nay theo con giáp](${SITE()}/tu-vi-hom-nay)

Chúc bạn một tháng nhẹ nhàng.`;
  return { subject: 'Chào mừng bạn đến với lịch ngày tốt TriMenh', html: wrap({ bodyHtml: textToHtml(body), unsubscribeUrl: unsub, preheader: 'Mỗi tháng một email, hủy bất cứ lúc nào' }), text: textOnly(body) + `\n\nHủy nhận: ${unsub}`, unsubscribeUrl: unsub };
}

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

/** Nháp email lịch tháng: lấy số liệu thật của tháng từ hệ thống tính lịch. */
export function monthlyDraft(data, tarot, mm, yyyy) {
  const best = data.ngayDepNhatThang || [];
  const first = best[0];
  // Tam Nương (mùng 3, 7, 13, 18, 22, 27 âm) và Nguyệt kỵ (mùng 5, 14, 23 âm): nhiều nhà tránh khi làm việc lớn
  const TAM = [3, 7, 13, 18, 22, 27];
  const NGUYET = [5, 14, 23];
  const note = (dd) => {
    const l = convertSolar2Lunar(dd, mm, yyyy).day;
    return TAM.includes(l) ? ' (Tam Nương, nhiều nhà kiêng)' : NGUYET.includes(l) ? ' (Nguyệt kỵ, nhiều nhà kiêng)' : '';
  };
  const days = best.map((d) => `- ${d.thu || ''} ${d.dd}/${d.mm}${note(d.dd)}: giờ đẹp ${(d.gioHoangDao || []).join(', ')}`.replace('-  ', '- ')).join('\n');
  const total = new Date(yyyy, mm, 0).getDate();
  const avoid = [];
  for (let d = 1; d <= total; d++) if (note(d)) avoid.push(`${d}/${mm}`);
  const tam = avoid.join(', ');
  const subject = first
    ? `Lịch ngày tốt tháng ${mm}/${yyyy}: ${data.tongSoNgayHoangDao} ngày Hoàng đạo, đẹp nhất là ${first.dd}/${first.mm}`
    : `Lịch ngày tốt tháng ${mm}/${yyyy}`;
  const body = `Chào bạn,

Tháng ${mm}/${yyyy} có ${data.tongSoNgayHoangDao} ngày Hoàng đạo trên ${data.soNgayTrongThang} ngày. Dưới đây là những ngày đẹp nhất để bạn tham khảo.

## Ngày đẹp nhất tháng ${mm}

${days}

${tam ? `## Ngày nên cân nhắc hơn\n\nNgày Tam Nương và Nguyệt kỵ trong tháng, nhiều nhà chọn tránh khi cưới hỏi, khai trương, động thổ: ${tam}.\n\n` : ''}## Lá bài của tháng

${tarot ? `Lá bài tarot tháng ${mm} là ${tarot.tenLa} (${String(tarot.xuoiHayNguoc).toLowerCase()}). [Đọc ý nghĩa](${tarot.urlChiTiet})` : 'Rút một lá bài cho riêng bạn tại [Tarot hôm nay](https://trimenh.com/tarot-hom-nay).'}

## Chọn ngày cho việc của bạn

Cưới hỏi, khai trương, động thổ, xuất hành: [xem ngày tốt theo việc](https://trimenh.com/xem-ngay-tot). Đổi sang âm lịch: [đổi lịch âm dương](https://trimenh.com/doi-lich-am-duong).

Chúc bạn một tháng thuận lợi.`;
  return { subject, body };
}

const TAM = [3, 7, 13, 18, 22, 27];
const NGUYET = [5, 14, 23];

/** Nháp email "nửa sau tháng": từ ngày 15 đến hết tháng. Gửi vào khoảng ngày 13. */
export function halfMonthDraft(mm, yyyy) {
  const total = new Date(yyyy, mm, 0).getDate();
  const dates = [];
  for (let d = 15; d <= total; d++) dates.push({ dd: d, mm, yyyy });
  let good = 0;
  const avoid = [];
  const moc = [];
  const tiet = [];
  let prevTk = getTietKhi(14, mm, yyyy);
  dates.forEach(({ dd }) => {
    const l = convertSolar2Lunar(dd, mm, yyyy);
    if (getSuggestedActivities(getTruc(dd, mm, yyyy, l.month)).isGoodDay) good++;
    if (TAM.includes(l.day) || NGUYET.includes(l.day)) avoid.push(`${dd}/${mm}`);
    if (l.day === 15) moc.push(`Rằm tháng ${l.month} âm lịch: ${dd}/${mm}`);
    if (l.day === 1) moc.push(`Mùng 1 tháng ${l.month} âm lịch: ${dd}/${mm}`);
    const tk = getTietKhi(dd, mm, yyyy);
    if (tk && tk !== prevTk) tiet.push(`Tiết ${tk} bắt đầu từ ${dd}/${mm}`);
    prevTk = tk;
  });
  const { best } = getBestAndWorstDays(dates, 5, 0);
  const picked = [...best].sort((a, b) => a.dd - b.dd);
  const note = (dd) => {
    const l = convertSolar2Lunar(dd, mm, yyyy).day;
    return TAM.includes(l) ? ' (Tam Nương, nhiều nhà kiêng)' : NGUYET.includes(l) ? ' (Nguyệt kỵ, nhiều nhà kiêng)' : '';
  };
  const days = picked.map((d) => `- ${d.thu || ''} ${d.dd}/${mm}${note(d.dd)}: giờ đẹp ${getGioHoangDao(d.dd, mm, yyyy).slice(0, 3).map((g) => `${g.chi} (${g.khung})`).join(', ')}`.replace('-  ', '- ')).join('\n');
  const first = picked[0];
  const subject = first
    ? `Nửa sau tháng ${mm}/${yyyy}: ${good} ngày Hoàng đạo từ 15/${mm}, đẹp nhất là ${first.dd}/${mm}`
    : `Nửa sau tháng ${mm}/${yyyy}: ngày tốt từ 15/${mm}`;
  const body = `Chào bạn,

Từ 15/${mm} đến hết tháng còn ${good} ngày Hoàng đạo trên ${dates.length} ngày. Dưới đây là những ngày đẹp để bạn tham khảo nếu đang định việc lớn trong nửa sau của tháng.

## Ngày đẹp từ 15/${mm}

${days || 'Nửa sau tháng này không có ngày nổi bật, bạn có thể chọn theo việc cụ thể ở công cụ bên dưới.'}

${moc.length || tiet.length ? `## Mốc đáng nhớ\n\n${[...moc, ...tiet].map((m) => `- ${m}`).join('\n')}\n\n` : ''}${avoid.length ? `## Ngày nên cân nhắc hơn\n\nNgày Tam Nương và Nguyệt kỵ trong khoảng này, nhiều nhà chọn tránh khi cưới hỏi, khai trương, động thổ: ${avoid.join(', ')}.\n\n` : ''}## Chọn ngày cho việc của bạn

[Xem ngày tốt theo việc](https://trimenh.com/xem-ngay-tot) hoặc [tử vi hôm nay theo con giáp](https://trimenh.com/tu-vi-hom-nay).

Chúc bạn nửa tháng thuận lợi.`;
  return { subject, body };
}
