import Link from 'next/link';
import { Sparkles, Hash, Users, Layers, ArrowRight } from 'lucide-react';
import PromoBanner from './PromoBanner';

const ITEMS = [
  { href: '/xem-ngay-tot', label: 'Xem ngày tốt', icon: Sparkles },
  { href: '/than-so-hoc', label: 'Thần số học', icon: Hash },
  { href: '/con-so-may-man', label: 'Con số may mắn', icon: Layers },
  { href: '/tu-vi-hom-nay', label: 'Tử vi hôm nay', icon: Users }
];

/**
 * Cột phải dùng chung: CTA email, công cụ phổ biến, (tùy chọn) tra theo năm sinh, banner.
 * Hiện ở màn hình rộng; trên điện thoại các CTA đã nằm trong bài.
 */
export default function SidebarTools({ year, seed = 'sidebar', showEmail = true }) {
  return (
    <aside className="hidden lg:block sticky top-20 space-y-5" aria-label="Công cụ và đăng ký">
      {showEmail && <PromoBanner placement="sidebar" seed={seed} compact />}
      <div className="mystic-card p-5">
        <p className="font-display font-bold text-parchment mb-2">Công cụ phổ biến</p>
        <div className="flex flex-col divide-y divide-ink-line">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2.5 py-2.5 text-sm text-parchment hover:text-lich transition-colors">
                <Icon size={16} className="text-lich" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      {year && (
        <div className="mystic-card p-5">
          <p className="font-display font-bold text-parchment mb-2">Bạn sinh năm {year}?</p>
          <div className="flex flex-col divide-y divide-ink-line">
            <Link href={`/${year}-menh-gi`} className="py-2.5 text-sm text-parchment hover:text-lich transition-colors flex items-center justify-between">Xem mệnh <ArrowRight size={14} aria-hidden="true" /></Link>
            <Link href={`/${year}-hop-tuoi-nao`} className="py-2.5 text-sm text-parchment hover:text-lich transition-colors flex items-center justify-between">Xem tuổi hợp <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      )}
    </aside>
  );
}
