import Link from 'next/link';
import { Facebook, Youtube } from 'lucide-react';
import { HUBS } from '../content/hubs';
import TikTokIcon from './TikTokIcon';

const SOCIALS = [
  { href: 'https://web.facebook.com/trimenhvn', label: 'Fanpage', icon: Facebook },
  { href: '#', label: 'YouTube', icon: Youtube },
  { href: '#', label: 'TikTok', icon: TikTokIcon }
];

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Brand + social */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-gold-soft font-display text-lg">TriMenh</p>
            <p className="text-moon/70 text-sm">Khám phá vận mệnh, kiến tạo tương lai.</p>
          </div>
          <div className="flex gap-3">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-ink-soft border border-ink-line flex items-center justify-center text-moon hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        {/* 2 cot tren mobile, 4 cot tren desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-parchment font-medium mb-3">Công cụ</p>
            <div className="flex flex-col gap-2">
              {HUBS.map((h) => (
                <Link key={h.slug} href={`/${h.slug}`} className="text-moon/80 hover:text-gold-soft transition-colors">{h.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-parchment font-medium mb-3">Nội dung</p>
            <div className="flex flex-col gap-2">
              <Link href="/tu-dien" className="text-moon/80 hover:text-gold-soft transition-colors">Từ điển huyền học</Link>
              <Link href="/cam-nang" className="text-moon/80 hover:text-gold-soft transition-colors">Cẩm nang</Link>
              <Link href="/gioi-thieu" className="text-moon/80 hover:text-gold-soft transition-colors">Giới thiệu</Link>
              <Link href="/lien-he" className="text-moon/80 hover:text-gold-soft transition-colors">Liên hệ</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-parchment font-medium mb-3">Khác</p>
            <div className="flex flex-col gap-2">
              <span className="text-moon/50">Chính sách bảo mật</span>
              <span className="text-moon/50">Điều khoản sử dụng</span>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-parchment font-medium mb-3">Theo dõi TriMenh</p>
            <p className="text-moon/70">Cập nhật ngày tốt, vận trình mỗi ngày qua Fanpage, YouTube, TikTok.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="max-w-6xl mx-auto px-5 py-5 text-xs text-moon/60">
          &copy; {new Date().getFullYear()} TriMenh.com. Nội dung chỉ mang tính tham khảo, chiêm nghiệm — không khuyến khích mê tín hay phụ thuộc vào dự đoán.
        </div>
      </div>
    </footer>
  );
}
