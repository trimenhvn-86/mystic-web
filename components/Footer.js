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
    <footer className="mt-16 bg-ink-soft border-t-4 border-parchment">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Brand + social */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-parchment font-display font-extrabold text-xl tracking-tight">Tri<span className="text-lich">Menh</span></p>
            <p className="text-moon text-sm">Khám phá vận mệnh, kiến tạo tương lai.</p>
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
                  className="w-9 h-9 rounded-full bg-ink border border-ink-line flex items-center justify-center text-moon hover:text-lich hover:border-lich transition-colors"
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
                <Link key={h.slug} href={`/${h.slug}`} className="text-moon hover:text-lich transition-colors">{h.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-parchment font-medium mb-3">Nội dung</p>
            <div className="flex flex-col gap-2">
              <Link href="/tu-dien" className="text-moon hover:text-lich transition-colors">Từ điển huyền học</Link>
              <Link href="/cam-nang" className="text-moon hover:text-lich transition-colors">Cẩm nang</Link>
              <Link href="/gioi-thieu" className="text-moon hover:text-lich transition-colors">Giới thiệu</Link>
              <Link href="/ban-bien-soan" className="text-moon hover:text-lich transition-colors">Ban biên soạn</Link>
              <Link href="/phuong-phap-tinh" className="text-moon hover:text-lich transition-colors">Phương pháp tính</Link>
              <Link href="/lien-he" className="text-moon hover:text-lich transition-colors">Liên hệ</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-parchment font-medium mb-3">Khác</p>
            <div className="flex flex-col gap-2">
              <Link href="/chinh-sach-bao-mat" className="text-moon hover:text-lich transition-colors">Chính sách bảo mật</Link>
              <Link href="/dieu-khoan-su-dung" className="text-moon hover:text-lich transition-colors">Điều khoản sử dụng</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-parchment font-medium mb-3">Theo dõi TriMenh</p>
            <p className="text-moon">Cập nhật ngày tốt, vận trình mỗi ngày qua Fanpage, YouTube, TikTok.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-line bg-ink">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-moon">
          <p>&copy; {new Date().getFullYear()} TriMenh.com. Nội dung chỉ mang tính tham khảo, chiêm nghiệm — không khuyến khích mê tín hay phụ thuộc vào dự đoán.</p>
          <div className="flex gap-4 flex-shrink-0">
            <Link href="/chinh-sach-bao-mat" className="hover:text-lich transition-colors">Chính sách bảo mật</Link>
            <Link href="/dieu-khoan-su-dung" className="hover:text-lich transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
