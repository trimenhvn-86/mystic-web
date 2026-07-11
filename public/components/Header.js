import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, CalendarDays, Hash, Layers, Users, Sun, CircleDot, BookOpen } from 'lucide-react';
import { HUBS } from '../content/hubs';

const ICONS = { CalendarDays, Hash, Layers, Users, Sun, CircleDot };

export default function Header() {
  const [open, setOpen] = useState(false);
  const navItems = [
    ...HUBS.map((h) => ({ href: `/${h.slug}`, label: h.name, icon: h.icon })),
    { href: '/cam-nang', label: 'Cẩm nang', icon: 'BookOpen' }
  ];

  return (
    <header className="border-b border-ink-line bg-ink/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)}>
          <Image src="/brand/trimenh-logo.png" alt="TriMenh" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10" priority />
          <span className="font-display text-xl sm:text-2xl text-parchment tracking-wide">
            Tri<span className="text-gold">Menh</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-5 text-sm text-moon">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gold transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button - kích thước chạm tối thiểu 44px */}
        <button
          type="button"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setOpen(!open)}
          className="lg:hidden w-11 h-11 flex items-center justify-center text-moon hover:text-gold transition-colors"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="lg:hidden border-t border-ink-line bg-ink px-5 py-3 flex flex-col">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon] || BookOpen;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 text-moon hover:text-gold-soft border-b border-ink-line last:border-0"
              >
                <Icon size={18} className="text-gold" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
