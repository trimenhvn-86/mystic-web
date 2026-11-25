import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsletterCTA from './NewsletterCTA';
import { getPromos } from '../content/promos';

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Banner giới thiệu dịch vụ của TriMenh (không phải quảng cáo bên thứ ba).
 * placement: 'inline' | 'sidebar'. seed: chuỗi để chọn banner ổn định theo trang (tránh đổi giữa các lần dựng).
 */
export default function PromoBanner({ placement = 'inline', seed = '', compact = false, kind }) {
  const list = getPromos(placement).filter((p) => !kind || p.kind === kind);
  if (list.length === 0) return null;
  const promo = list[hash(seed || placement) % list.length];

  if (promo.kind === 'newsletter') {
    return <NewsletterCTA title={promo.title} text={promo.text} button={promo.button} source={`${placement}-${promo.id}`} compact={compact} />;
  }
  return (
    <aside className="mystic-card p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-parchment leading-snug">{promo.title}</p>
        <p className="text-sm text-moon mt-1">{promo.text}</p>
      </div>
      <Link href={promo.href} className="btn-line px-4 py-2.5 text-sm inline-flex items-center gap-2 self-start sm:self-center whitespace-nowrap">
        {promo.button} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </aside>
  );
}

/**
 * CTA giữa/cuối bài cho trang CÓ cột phải: cột phải (màn hình rộng) đã có khung email,
 * nên trong bài chỉ hiện khung email trên điện thoại, còn máy tính hiện banner dẫn về công cụ.
 */
export function InlineCTA({ seed }) {
  // Chỉ điện thoại: máy tính đã có khung email ở cột phải.
  return <div className="lg:hidden"><PromoBanner placement="inline" seed={seed} kind="newsletter" /></div>;
}
