import Link from 'next/link';

export default function HubToolBreadcrumb({ current }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-moon mb-6">
      <Link href="/" className="hover:text-gold-soft transition-colors">Trang chủ</Link>
      <span>/</span>
      <Link href="/lich-ngay-tot" className="hover:text-gold-soft transition-colors">Lịch &amp; Ngày Tốt</Link>
      <span>/</span>
      <span className="text-parchment/70">{current}</span>
    </div>
  );
}
