import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import PromoBanner from './PromoBanner';
import { getPromos } from '../content/promos';

/**
 * Chỗ đặt banner trong trang (đang dùng ở nhiều loại trang).
 * - Khi NEXT_PUBLIC_ADS_ENABLED = 'true': hiện khung quảng cáo thật (thay phần <ins> bằng mã AdSense).
 * - Chưa bật quảng cáo: hiện banner giới thiệu dịch vụ miễn phí của TriMenh (cấu hình ở content/promos.js).
 * Lưu ý chính sách AdSense: không tự làm mới quảng cáo khi người dùng đổi tab trong trang.
 */
export default function AdSlot({ label = 'Quảng cáo', className = '', slim = false }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== 'true') {
    // Bản mỏng cho chỗ lặp nhiều lần trong một trang (mỗi tab kết quả): một dòng, không có ô nhập.
    if (slim) {
      const nl = getPromos('inline').find((p) => p.kind === 'newsletter');
      if (!nl) return null;
      return (
        <div className={className}>
          <Link href="/#nhan-email" className="flex items-center gap-3 rounded-md border border-ink-line bg-ink px-4 py-3 text-sm text-parchment hover:border-parchment transition-colors">
            <Mail size={16} className="text-lich flex-shrink-0" aria-hidden="true" />
            <span className="flex-1 min-w-0"><strong className="font-semibold">{nl.title}.</strong> <span className="text-moon">Miễn phí.</span></span>
            <ArrowRight size={16} className="flex-shrink-0" aria-hidden="true" />
          </Link>
        </div>
      );
    }
    return (
      <div className={className}>
        <PromoBanner placement="inline" seed={label} />
      </div>
    );
  }
  return (
    <div className={className}>
      <p className="text-[11px] text-moon mb-1">Quảng cáo</p>
      <div className="ad-frame w-full min-h-[100px] flex items-center justify-center text-xs text-moon/60">
        {/* TODO: thay bằng <ins class="adsbygoogle" ...></ins> thật */}
      </div>
    </div>
  );
}
