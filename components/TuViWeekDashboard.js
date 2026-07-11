import Link from 'next/link';
import { CalendarRange } from 'lucide-react';
import AdSlot from './AdSlot';
import ResultTabs from './ResultTabs';
import ProgressBar from './ProgressBar';
import FaqSection from './FaqSection';
import HubContentPreview from './HubContentPreview';
import { FAQ_TU_VI_TUAN } from '../content/faq-data';

function pad(n) { return String(n).padStart(2, '0'); }
function slugOfDay(dd, mm, yyyy) { return `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

export default function TuViWeekDashboard({ week, year, monday, sunday, tongQuan, indexScores, best, worst, all, dictionaryPreview, guidePreview }) {
  const rangeStr = `${pad(monday.dd)}/${pad(monday.mm)} - ${pad(sunday.dd)}/${pad(sunday.mm)}/${sunday.yyyy}`;

  const conGiapTabs = all.map((item) => ({
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
      </div>
    )
  }));

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <CalendarRange size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1">Tử Vi Tuần {week}/{year}</h1>
        <p className="text-moon/70 text-sm">{rangeStr}</p>
      </div>

      <div className="mystic-card p-6 mb-6">
        <p className="text-gold-soft font-semibold mb-2">Tổng quan tuần này</p>
        <p className="text-parchment/85 leading-relaxed text-sm">{tongQuan}</p>
      </div>

      <div className="mystic-card p-6 mb-6 space-y-4">
        <p className="text-gold-soft font-semibold">Chỉ số vận trình tuần</p>
        <ProgressBar label="Công việc" value={indexScores.congViec} />
        <ProgressBar label="Tài chính" value={indexScores.taiChinh} />
        <ProgressBar label="Tình cảm" value={indexScores.tinhCam} />
        <ProgressBar label="Sức khỏe" value={indexScores.suckKhoe} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="mystic-card p-5 border-jade/30">
          <p className="text-jade font-semibold mb-3">Ngày đẹp nhất trong tuần</p>
          <div className="space-y-2">
            {best.length > 0 ? best.map((d) => (
              <Link key={`${d.dd}-${d.mm}`} href={`/xem-ngay-tot/${slugOfDay(d.dd, d.mm, d.yyyy)}`} className="flex items-center justify-between text-sm hover:text-gold-soft transition-colors">
                <span>{d.thu} ({pad(d.dd)}/{pad(d.mm)})</span>
                <span className="text-gold">{'★'.repeat(d.stars)}</span>
              </Link>
            )) : <p className="text-sm text-moon/60">Không có ngày nổi bật rõ rệt tuần này.</p>}
          </div>
        </div>
        <div className="mystic-card p-5 border-vermilion/30">
          <p className="text-vermilion font-semibold mb-3">Ngày cần lưu ý</p>
          <div className="space-y-2">
            {worst.length > 0 ? worst.map((d) => (
              <Link key={`${d.dd}-${d.mm}`} href={`/xem-ngay-tot/${slugOfDay(d.dd, d.mm, d.yyyy)}`} className="flex items-center justify-between text-sm hover:text-gold-soft transition-colors">
                <span>{d.thu} ({pad(d.dd)}/{pad(d.mm)})</span>
                <span className="text-vermilion">{'★'.repeat(d.stars)}</span>
              </Link>
            )) : <p className="text-sm text-moon/60">Không có ngày cần lưu ý đặc biệt tuần này.</p>}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gold-soft font-semibold mb-3">Tử vi 12 con giáp tuần này</p>
        <ResultTabs tabs={conGiapTabs} />
      </div>

      <AdSlot label="Ad slot — tử vi tuần" className="mb-6" />

      <div className="mb-6">
        <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
          <Link href="/doi-lich-am-duong" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Đổi lịch âm</Link>
          <Link href="/gio-hoang-dao" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Giờ hoàng đạo</Link>
          <Link href="/tuoi-hop" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tuổi hợp</Link>
          <Link href="/tu-vi-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tử vi hôm nay</Link>
          <Link href="/tu-vi-thang" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tử vi tháng</Link>
        </div>
      </div>

      <FaqSection faqs={FAQ_TU_VI_TUAN} />

      <div className="mt-8">
        <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </div>

      <p className="text-xs text-moon/50 mt-8 text-center">
        Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
      </p>
    </>
  );
}
