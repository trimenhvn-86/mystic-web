import { Download, Facebook, Send } from 'lucide-react';

function pad(n) { return String(n).padStart(2, '0'); }

export default function ShareCalendarImage({ dd, mm, yyyy, pageUrl }) {
  const imgUrl = `/api/lich-anh?dd=${dd}&mm=${mm}&yyyy=${yyyy}`;
  const fileName = `trimenh-lich-${pad(dd)}-${pad(mm)}-${yyyy}.png`;
  const shareUrl = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const caption = encodeURIComponent(`Lịch vạn niên ngày ${dd}/${mm}/${yyyy} — xem chi tiết tại TriMenh`);

  return (
    <div className="mystic-card p-6">
      <p className="text-gold-soft font-semibold mb-4 text-center">Chia sẻ ảnh lịch hôm nay</p>
      <div className="max-w-xs mx-auto mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt={`Ảnh lịch ngày ${dd}/${mm}/${yyyy}`} className="w-full rounded-lg border border-ink-line" loading="lazy" />
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <a
          href={imgUrl}
          download={fileName}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Download size={15} /> Tải ảnh
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
        >
          <Facebook size={15} /> Facebook
        </a>
        <a
          href={`https://zalo.me/share?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
        >
          <Send size={15} /> Zalo
        </a>
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${caption}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
        >
          <Send size={15} /> Telegram
        </a>
      </div>
      <p className="text-xs text-moon/50 text-center mt-4">
        Ảnh tự sinh từ dữ liệu hệ thống — khi dán link trang này lên Facebook/Zalo, ảnh sẽ tự hiện kèm theo.
      </p>
    </div>
  );
}
