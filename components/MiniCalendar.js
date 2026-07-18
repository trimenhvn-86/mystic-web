import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { convertSolar2Lunar } from '../lib/lunar';
import { getTruc, getSuggestedActivities } from '../lib/dayQuality';

const THU_HEADER = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function pad(n) {
  return String(n).padStart(2, '0');
}

function buildSlug(basePath, dd, mm, yyyy) {
  return `${basePath}/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`;
}

/**
 * showQuality: nếu true, tô màu từng ngày theo Hoàng đạo (vàng nhạt) / Hắc đạo (đỏ nhạt),
 * tính trực tiếp bằng lib/dayQuality - đủ nhanh cho 1 tháng (tối đa 31 ngày).
 */
export default function MiniCalendar({ dd, mm, yyyy, basePath = '/doi-lich-am-duong', showQuality = false }) {
  const router = useRouter();
  const [jumpMonth, setJumpMonth] = useState(mm);
  const [jumpYear, setJumpYear] = useState(yyyy);

  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  const firstDayOfWeek = new Date(yyyy, mm - 1, 1).getDay(); // 0=CN
  const prevMonth = mm === 1 ? { mm: 12, yyyy: yyyy - 1 } : { mm: mm - 1, yyyy };
  const nextMonth = mm === 12 ? { mm: 1, yyyy: yyyy + 1 } : { mm: mm + 1, yyyy };

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function getQuality(d) {
    if (!showQuality) return null;
    try {
      const lunar = convertSolar2Lunar(d, mm, yyyy);
      const truc = getTruc(d, mm, yyyy, lunar.month);
      return getSuggestedActivities(truc).isGoodDay;
    } catch {
      return null;
    }
  }

  function getLunarDay(d) {
    try {
      const lunar = convertSolar2Lunar(d, mm, yyyy);
      return `${lunar.day}/${lunar.month}`;
    } catch {
      return '';
    }
  }

  function handleJump(e) {
    e.preventDefault();
    router.push(buildSlug(basePath, 1, Number(jumpMonth), Number(jumpYear)));
  }

  return (
    <div id="lich-thang" className="mystic-card p-5 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <Link href={buildSlug(basePath, 1, prevMonth.mm, prevMonth.yyyy)} className="text-moon hover:text-gold-soft px-2 py-1">‹‹</Link>
        <p className="font-display text-lg text-parchment">Tháng {mm} - {yyyy}</p>
        <Link href={buildSlug(basePath, 1, nextMonth.mm, nextMonth.yyyy)} className="text-moon hover:text-gold-soft px-2 py-1">››</Link>
      </div>

      {/* Chon nhanh thang/nam bat ky */}
      <form onSubmit={handleJump} className="flex items-center gap-2 mb-4">
        <select
          value={jumpMonth}
          onChange={(e) => setJumpMonth(e.target.value)}
          className="bg-ink-soft border border-ink-line rounded-lg px-2 py-1.5 text-sm text-parchment flex-1"
        >
          {MONTH_OPTIONS.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
        </select>
        <input
          type="number"
          value={jumpYear}
          onChange={(e) => setJumpYear(e.target.value)}
          className="bg-ink-soft border border-ink-line rounded-lg px-2 py-1.5 text-sm text-parchment w-20"
        />
        <button type="submit" className="px-3 py-1.5 rounded-lg bg-gold text-ink text-sm font-semibold">Xem</button>
      </form>

      {showQuality && (
        <div className="flex items-center gap-4 mb-3 text-xs text-moon">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" /> Hoàng đạo</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-vermilion inline-block" /> Hắc đạo</span>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-moon/60 mb-2">
        {THU_HEADER.map((t) => <div key={t}>{t}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const isGood = getQuality(d);
          let qualityClass = '';
          if (showQuality && d !== dd) {
            qualityClass = isGood ? 'bg-gold/15 text-gold-soft border border-gold/30' : 'bg-vermilion/10 text-vermilion/80 border border-vermilion/20';
          }
          return (
            <Link
              key={d}
              href={buildSlug(basePath, d, mm, yyyy)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors leading-tight ${
                d === dd ? 'bg-gold text-ink font-semibold' : `text-parchment/80 hover:bg-ink-soft ${qualityClass}`
              }`}
            >
              <span>{d}</span>
              <span className={`text-[9px] ${d === dd ? 'text-ink/70' : 'text-moon/50'}`}>{getLunarDay(d)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
