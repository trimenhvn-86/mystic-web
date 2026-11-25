import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Menu, X, Search, CalendarDays, Hash, Layers, Users, Sun, CircleDot, BookOpen } from 'lucide-react';
import { HUBS } from '../content/hubs';

const ICONS = { CalendarDays, Hash, Layers, Users, Sun, CircleDot };

export default function Header() {
  const [open, setOpen] = useState(false);
  const { asPath } = useRouter();
  const navItems = [
    ...HUBS.map((h) => ({ href: `/${h.slug}`, label: h.name, icon: h.icon })),
    { href: '/cam-nang', label: 'Cẩm nang', icon: 'BookOpen' }
  ];
  const isActive = (href) => asPath === href || asPath.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-ink-line">
      {/* Dải đỏ như mép trên của tờ lịch */}
      <div className="h-1.5 bg-lich" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)} aria-label="TriMenh, về trang chủ">
          {/* Logo vàng đặt trên nền mực như con dấu để giữ độ tương phản */}
          <span className="w-10 h-10 rounded-md bg-parchment flex items-center justify-center">
            <Image src="/brand/trimenh-logo.png" alt="" width={32} height={32} className="w-8 h-8" priority />
          </span>
          <span className="font-display font-extrabold text-xl sm:text-2xl text-parchment tracking-tight">
            Tri<span className="text-lich">Menh</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Chuyên mục">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`px-3 py-2 whitespace-nowrap border-b-2 transition-colors ${
                isActive(item.href) ? 'border-lich text-parchment font-semibold' : 'border-transparent text-moon hover:text-parchment hover:border-ink-line'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/tim-kiem" aria-label="Tìm kiếm" className="ml-2 w-10 h-10 flex items-center justify-center text-moon hover:text-parchment"><Search size={18} /></Link>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="lg:hidden w-11 h-11 flex items-center justify-center text-parchment"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-ink-line bg-ink px-5 py-2 flex flex-col" aria-label="Chuyên mục">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon] || BookOpen;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 text-parchment border-b border-ink-line"
              >
                <Icon size={18} className="text-lich" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <Link href="/tim-kiem" onClick={() => setOpen(false)} className="flex items-center gap-3 py-3 text-parchment">
            <Search size={18} className="text-lich" aria-hidden="true" /> Tìm kiếm
          </Link>
        </nav>
      )}
    </header>
  );
}
