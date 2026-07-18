import Link from 'next/link';
import { CHI_SLUG } from '../lib/chiSlug';
import { Calendar } from 'lucide-react';
import AdSlot from './AdSlot';
import ResultTabs from './ResultTabs';
import ProgressBar from './ProgressBar';
import FaqSection from './FaqSection';
import HubContentPreview from './HubContentPreview';
import { FAQ_TU_VI_THANG } from '../content/faq-data';

function pad(n) { return String(n).padStart(2, '0'); }
function slugOfDay(dd, mm, yyyy) { return `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

export default function TuViMonthDashboard({ mm, yyyy, tongQuan, indexScores, best, worst, timeline, all, dictionaryPreview, guidePreview }) {
  const conGiapTabs = all.map((item) => {
    const slug = CHI_SLUG[item.conGiap];
    return {
      key: item.conGiap,
      label: `Tuổi ${item.conGiap}`,
      content: (
        <div className="space-y-3 text-sm">
          <p className="text-xs text-moon">Mệnh {item.hanh}</p>
          <div><p className="text-gold-soft font-medium mb-1">Tổng quan</p><p>{item.tongQuan}</p></div>
          <div><p className="text-gold-soft font-medium mb-1">Công danh</p><p>{item.congDanh}</p></div>
          <div><p className="text-gold-soft font-medium mb-1">Tài lộc</p><p>{item.taiLoc}</p></div>
          <div><p className="text-gold-soft font-medium mb-1">Tình duyên</p><p>{item.tinhDuyen}</p></div>
          <p className="text-moon">Màu may mắn: <strong className="text-parchment">{item.mauMayMan}</strong></p>
          <div className="flex flex-wrap gap-2 pt-2 mystic-divider">
            <Link href={`/tu-vi-hom-nay/${slug}`} className="text-xs text-gold-soft hover:underline">Tử vi hôm nay tuổi {item.conGiap} →</Link>
            <Link href={`/tu-vi-tuan/${slug}`} className="text-xs text-gold-soft hover:underline">Tử vi tuần tuổi {item.conGiap} →</Link>
            <Link href={`/tu-vi-thang/${slug}`} className="text-xs text-gold-soft hover:underline">Tử vi tháng tuổi {item.conGiap} →</Link>
          </div>
        </div>
      )
    };
  });

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Calendar size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1">Tử Vi Tháng {mm}/{yyyy}</h1>
      </div>

      <div className="mystic-card p-6 mb-6">
        <p className="text-gold-soft font-semibold mb-2">Tổng quan tháng này</p>
        <p className="text-parchment/85 leading-relaxed text-sm">{tongQuan}</p>
      </div>

      <div className="mystic-card p-6 mb-6 space-y-4">
        <p className="text-gold-soft font-semibold">Vận trình theo lĩnh vực</p>
        <ProgressBar label="Công việc" value={indexScores.congViec} />
        <ProgressBar label="Tài chính" value={indexScores.taiChinh} />
        <ProgressBar label="Tình cảm" value={indexScores.tinhCam} />
        <ProgressBar label="Sức khỏe" value={indexScores.suckKhoe} />
      </div>

      <div className="mystic-card p-6 mb-6">
        <p className="text-gold-soft font-semibold mb-3">Timeline theo tuần</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {timeline.map((t) => (
            <div key={t.label} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-2.5 border border-ink-line">
              <span className="text-parchment">{t.label}</span>
              <span className="text-gold">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="mystic-card p-5 border-jade/30">
          <p className="text-jade font-semibold mb-3">Những ngày đẹp nhất trong tháng</p>
          <div className="flex flex-wrap gap-2">
            {best.map((d) => (
              <Link key={`${d.dd}`} href={`/xem-ngay-tot/${slugOfDay(d.dd, d.mm, d.yyyy)}`} className="w-10 h-10 rounded-full bg-ink-soft border border-jade/40 flex items-center justify-center text-sm hover:border-jade transition-colors">
                {d.dd}
              </Link>
            ))}
          </div>
        </div>
        <div className="mystic-card p-5 border-vermilion/30">
          <p className="text-vermilion font-semibold mb-3">Những ngày nên tránh</p>
          <div className="flex flex-wrap gap-2">
            {worst.length > 0 ? worst.map((d) => (
              <Link key={`${d.dd}`} href={`/xem-ngay-tot/${slugOfDay(d.dd, d.mm, d.yyyy)}`} className="w-10 h-10 rounded-full bg-ink-soft border border-vermilion/40 flex items-center justify-center text-sm hover:border-vermilion transition-colors">
                {d.dd}
              </Link>
            )) : <p className="text-sm text-moon/60">Không có ngày cần lưu ý đặc biệt tháng này.</p>}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gold-soft font-semibold mb-3">Tử vi 12 con giáp tháng này</p>
        <ResultTabs tabs={conGiapTabs} />
      </div>

      <AdSlot label="Ad slot — tử vi tháng" className="mb-6" />

      <div className="mb-6">
        <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/tu-vi-tuan" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tử vi tuần</Link>
          <Link href="/tu-vi-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tử vi hôm nay</Link>
        </div>
      </div>

      <FaqSection faqs={FAQ_TU_VI_THANG} />

      <div className="mt-8">
        <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </div>

      <p className="text-xs text-moon/50 mt-8 text-center">
        Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
      </p>
    </>
  );
}
