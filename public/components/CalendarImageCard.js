import { Download, Facebook, Send } from 'lucide-react';

function pad(n) { return String(n).padStart(2, '0'); }

export default function CalendarImageCard({ dd, mm, yyyy }) {
  const imgUrl = `/api/lich-anh?dd=${dd}&mm=${mm}&yyyy=${yyyy}`;
  const fileName = `trimenh-lich-${pad(dd)}-${pad(mm)}-${yyyy}.png`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="w-full max-w-[340px] mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt={`Ảnh lịch ngày ${dd}/${mm}/${yyyy}`}
        className="w-full rounded-xl shadow-xl -rotate-1"
        loading="lazy"
      />
      <div className="flex items-center justify-center gap-2 mt-3">
        <a
          href={imgUrl}
          download={fileName}
          aria-label="Tải ảnh lịch"
          className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Download size={15} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ Facebook"
          className="w-9 h-9 rounded-full bg-ink-soft border border-ink-line flex items-center justify-center text-moon hover:text-gold-soft hover:border-gold/40 transition-colors"
        >
          <Facebook size={15} />
        </a>
        <a
          href={`https://zalo.me/share?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chia sẻ Zalo"
          className="w-9 h-9 rounded-full bg-ink-soft border border-ink-line flex items-center justify-center text-moon hover:text-gold-soft hover:border-gold/40 transition-colors"
        >
          <Send size={15} />
        </a>
      </div>
    </div>
  );
}
