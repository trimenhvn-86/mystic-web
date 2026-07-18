import Link from 'next/link';
import { Sun, Briefcase, Wallet, Heart, HeartPulse, Compass } from 'lucide-react';
import AdSlot from './AdSlot';
import ResultTabs from './ResultTabs';
import ProgressBar from './ProgressBar';
import FaqSection from './FaqSection';
import HubContentPreview from './HubContentPreview';
import { FAQ_TU_VI_NGAY } from '../content/faq-data';
import { CHI_SLUG } from '../lib/chiSlug';

const QUICK_ITEMS = [
  { key: 'cong-viec', label: 'Công việc', icon: Briefcase },
  { key: 'tai-loc', label: 'Tài lộc', icon: Wallet },
  { key: 'tinh-cam', label: 'Tình cảm', icon: Heart },
  { key: 'suc-khoe', label: 'Sức khỏe', icon: HeartPulse },
  { key: 'xuat-hanh', label: 'Xuất hành', icon: Compass }
];

export default function TuViDayDashboard({ dashboard, dateStr, prevSlug, nextSlug, dictionaryPreview, guidePreview }) {
  const { canChiNgay, lunar, rating, tongQuan, indexScores, gioHoangDao, gioHacDao, activities, tuoiHopHomNay, napAmNgay, all } = dashboard;
  const summary = `Hôm nay là ngày ${canChiNgay}, Âm lịch ${lunar.day}/${lunar.month}${lunar.leap ? ' (nhuận)' : ''}/${lunar.year}. Vận trình chung ${rating.label.toLowerCase()}, chỉ số nổi bật nhất là ${indexScores.taiChinh >= indexScores.tinhCam ? 'tài chính' : 'tình cảm'}, nên lưu ý thêm ở phần ${Math.min(indexScores.congViec, indexScores.suckKhoe) === indexScores.congViec ? 'công việc' : 'sức khỏe'}.`;

  const conGiapTabs = all.map((item) => {
    const slug = CHI_SLUG[item.conGiap];
    return {
      key: item.conGiap,
      label: `Tuổi ${item.conGiap}`,
      content: (
        <div className="space-y-3 text-sm">
          <p className="text-xs text-moon">Mệnh {item.hanh}</p>
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
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sun size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1">Tử Vi Hôm Nay {dateStr}</h1>
        <p className="text-moon/70 text-sm mb-3">Ngày {canChiNgay} — Âm lịch {lunar.day}/{lunar.month}{lunar.leap ? ' (nhuận)' : ''}/{lunar.year}</p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= rating.stars ? 'text-gold' : 'text-ink-line'}>★</span>
          ))}
          <span className="text-sm text-moon ml-2">{rating.label}</span>
        </div>
      </div>

      <p className="text-moon/80 text-center max-w-xl mx-auto mb-8 leading-relaxed">{summary}</p>

      {/* Xem nhanh */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {QUICK_ITEMS.map((q) => {
          const Icon = q.icon;
          return (
            <a key={q.key} href={`#${q.key}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink-line text-xs text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
              <Icon size={13} className="text-gold" /> {q.label}
            </a>
          );
        })}
      </div>

      {/* Tong quan */}
      <div className="mystic-card p-6 mb-6">
        <p className="text-gold-soft font-semibold mb-2">Tổng quan hôm nay</p>
        <p className="text-parchment/85 leading-relaxed text-sm">{tongQuan}</p>
      </div>

      {/* Chi so van trinh */}
      <div id="cong-viec" className="mystic-card p-6 mb-6 space-y-4 scroll-mt-20">
        <p className="text-gold-soft font-semibold">Chỉ số vận trình hôm nay</p>
        <ProgressBar label="Công việc" value={indexScores.congViec} />
        <div id="tai-loc" className="scroll-mt-20"><ProgressBar label="Tài chính" value={indexScores.taiChinh} /></div>
        <div id="tinh-cam" className="scroll-mt-20"><ProgressBar label="Tình cảm" value={indexScores.tinhCam} /></div>
        <div id="suc-khoe" className="scroll-mt-20"><ProgressBar label="Sức khỏe" value={indexScores.suckKhoe} /></div>
        <ProgressBar label="May mắn" value={indexScores.mayMan} />
      </div>

      {/* 12 con giap accordion */}
      <div className="mb-6">
        <p className="text-gold-soft font-semibold mb-3">Vận trình 12 con giáp</p>
        <ResultTabs tabs={conGiapTabs} />
      </div>

      {/* Nen lam / kieng ky */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="mystic-card p-5 border-jade/30">
          <p className="text-jade font-semibold mb-2">Hôm nay nên làm gì</p>
          <ul className="text-sm space-y-1 text-parchment/85">
            {activities.nenLam.map((v) => <li key={v}>✓ {v}</li>)}
          </ul>
        </div>
        <div className="mystic-card p-5 border-vermilion/30">
          <p className="text-vermilion font-semibold mb-2">Hôm nay nên tránh gì</p>
          <ul className="text-sm space-y-1 text-parchment/70">
            {activities.kiengKy.map((v) => <li key={v}>✗ {v}</li>)}
          </ul>
        </div>
      </div>

      {/* Gio may man */}
      <div id="xuat-hanh" className="mystic-card p-6 mb-6 scroll-mt-20">
        <p className="text-gold-soft font-semibold mb-3">Giờ may mắn</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {gioHoangDao.map((g) => (
            <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-2.5 border border-ink-line">
              <span className="text-gold-soft font-display">Giờ {g.chi}</span>
              <span className="text-moon text-sm">{g.khung}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gio can tranh */}
      <div className="mystic-card p-6 mb-6">
        <p className="text-vermilion font-semibold mb-3">Giờ cần tránh</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {gioHacDao.map((g) => (
            <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-2.5 border border-ink-line opacity-80">
              <span className="text-vermilion/90 font-display">Giờ {g.chi}</span>
              <span className="text-moon text-sm">{g.khung}</span>
            </div>
          ))}
        </div>
      </div>

      <AdSlot label="Ad slot — tử vi hôm nay" className="mb-6" />

      {/* Mau sac / con so */}
      {napAmNgay && (
        <div className="mystic-card p-6 mb-6 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-moon uppercase mb-2">Màu hợp hôm nay</p>
            <div className="flex flex-wrap gap-2">
              {napAmNgay.mauHop.map((m) => (
                <span key={m} className="px-3 py-1 rounded-full bg-ink-soft border border-ink-line text-sm">{m}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-moon uppercase mb-2">Mệnh ngày</p>
            <p className="text-parchment">{napAmNgay.napAm} ({napAmNgay.hanh})</p>
          </div>
        </div>
      )}

      {/* Tuoi hop */}
      <div className="mystic-card p-6 mb-6">
        <p className="text-gold-soft font-semibold mb-3">Tuổi hợp hôm nay</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-jade text-sm mb-2">Hợp</p>
            <div className="flex flex-wrap gap-2">
              {tuoiHopHomNay.hopTuoi.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-jade/40 text-sm">Tuổi {c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-vermilion text-sm mb-2">Tuổi xung</p>
            <div className="flex flex-wrap gap-2">
              {tuoiHopHomNay.xungTuoi.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-vermilion/40 text-sm">Tuổi {c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cong cu lien quan - chi giu tool cung Hub Tu Vi */}
      <div className="mb-6">
        <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/tu-vi-tuan" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tử vi tuần</Link>
          <Link href="/tu-vi-thang" className="px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold-soft hover:bg-gold/10 transition-colors">Tử vi tháng</Link>
        </div>
      </div>

      <FaqSection faqs={FAQ_TU_VI_NGAY} />

      {/* Hom qua - hom nay - ngay mai */}
      <div className="flex items-center justify-between mt-8 mb-6 text-sm">
        <Link href={`/tu-vi-hom-nay/${prevSlug}`} className="text-moon hover:text-gold-soft">← Hôm qua</Link>
        <span className="text-moon/50">{dateStr}</span>
        <Link href={`/tu-vi-hom-nay/${nextSlug}`} className="text-moon hover:text-gold-soft">Ngày mai →</Link>
      </div>

      <div className="mt-8">
        <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </div>

      <p className="text-xs text-moon/50 mt-8 text-center">
        Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
      </p>
    </>
  );
}
