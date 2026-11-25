import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube } from 'lucide-react';
import { HUBS } from '../content/hubs';
import TikTokIcon from './TikTokIcon';

const SOCIALS = [
  { href: 'https://web.facebook.com/trimenhvn', label: 'Fanpage', icon: Facebook },
  { href: '#', label: 'YouTube', icon: Youtube },
  { href: '#', label: 'TikTok', icon: TikTokIcon }
];

export default function Footer({ noTopMargin = false }) {
  return (
    <footer className={`${noTopMargin ? '' : 'mt-16 '}bg-ink-soft ${noTopMargin ? 'border-t border-ink-line' : 'border-t-4 border-parchment'}`}>
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Brand + social */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/" aria-label="TriMenh, về trang chủ" className="inline-flex w-14 h-14 rounded-md bg-parchment items-center justify-center">
              <Image src="/brand/trimenh-logo.png" alt="TriMenh" width={44} height={44} className="w-11 h-11" />
            </Link>
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

        {/* Cột 1 và 2: công cụ. Cột 3: nội dung. Cột 4: chính sách. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 text-sm">
          <div>
            <p className="text-parchment font-semibold mb-3">Công cụ</p>
            <div className="flex flex-col gap-2">
              {HUBS.slice(0, Math.ceil(HUBS.length / 2)).map((h) => (
                <Link key={h.slug} href={`/${h.slug}`} className="text-moon hover:text-lich transition-colors">{h.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-parchment font-semibold mb-3" aria-hidden="true">&nbsp;</p>
            <div className="flex flex-col gap-2">
              {HUBS.slice(Math.ceil(HUBS.length / 2)).map((h) => (
                <Link key={h.slug} href={`/${h.slug}`} className="text-moon hover:text-lich transition-colors">{h.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-parchment font-semibold mb-3">Nội dung</p>
            <div className="flex flex-col gap-2">
              <Link href="/tu-dien" className="text-moon hover:text-lich transition-colors">Từ điển huyền học</Link>
              <Link href="/cam-nang" className="text-moon hover:text-lich transition-colors">Cẩm nang</Link>
              <Link href="/ban-bien-soan" className="text-moon hover:text-lich transition-colors">Ban biên soạn</Link>
              <Link href="/phuong-phap-tinh" className="text-moon hover:text-lich transition-colors">Phương pháp tính</Link>
            </div>
          </div>
          <div>
            <p className="text-parchment font-semibold mb-3">Thông tin</p>
            <div className="flex flex-col gap-2">
              <Link href="/gioi-thieu" className="text-moon hover:text-lich transition-colors">Giới thiệu</Link>
              <Link href="/lien-he" className="text-moon hover:text-lich transition-colors">Liên hệ</Link>
              <Link href="/chinh-sach-bao-mat" className="text-moon hover:text-lich transition-colors">Chính sách bảo mật</Link>
              <Link href="/dieu-khoan-su-dung" className="text-moon hover:text-lich transition-colors">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-line bg-ink">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-moon">
          <p>&copy; {new Date().getFullYear()} TriMenh.com. Nội dung chỉ mang tính tham khảo, chiêm nghiệm — không khuyến khích mê tín hay phụ thuộc vào dự đoán.</p>
        </div>
      </div>
    </footer>
  );
}
