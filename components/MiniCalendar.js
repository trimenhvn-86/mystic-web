import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { convertSolar2Lunar } from '../lib/lunar';
import { getTruc, getSuggestedActivities } from '../lib/dayQuality';

const THU_HEADER = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function pad(n) { return String(n).padStart(2, '0'); }
function buildSlug(basePath, dd, mm, yyyy) { return `${basePath}/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

/**
 * Lịch tháng. showQuality: tô Hoàng đạo / Hắc đạo.
 * Ba trạng thái tách rõ, không chỉ bằng màu: Hoàng đạo = nền xanh nhạt + chấm đặc;
 * Hắc đạo = nền xám + chấm rỗng; hôm nay = viền mực dày; ngày đang xem = nền đỏ.
 */
export default function MiniCalendar({ dd, mm, yyyy, basePath = '/doi-lich-am-duong', showQuality = false }) {
  const router = useRouter();
  const [jumpMonth, setJumpMonth] = useState(mm);
  const [jumpYear, setJumpYear] = useState(yyyy);
  const [todayKey, setTodayKey] = useState('');

  useEffect(() => {
    const n = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    setTodayKey(`${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`);
  }, []);

  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  const firstDayOfWeek = new Date(yyyy, mm - 1, 1).getDay();
  const prevMonth = mm === 1 ? { mm: 12, yyyy: yyyy - 1 } : { mm: mm - 1, yyyy };
  const nextMonth = mm === 12 ? { mm: 1, yyyy: yyyy + 1 } : { mm: mm + 1, yyyy };

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function info(d) {
    try {
      const lunar = convertSolar2Lunar(d, mm, yyyy);
      let good = null;
      if (showQuality) good = getSuggestedActivities(getTruc(d, mm, yyyy, lunar.month)).isGoodDay;
      return { lunarText: lunar.day === 1 ? `${lunar.day}/${lunar.month}` : `${lunar.day}`, good };
    } catch { return { lunarText: '', good: null }; }
  }

  function handleJump(e) {
    e.preventDefault();
    router.push(buildSlug(basePath, 1, Number(jumpMonth), Number(jumpYear)));
  }

  const navBtn = 'w-11 h-11 flex items-center justify-center rounded-md text-moon hover:text-parchment hover:bg-ink-soft';

  return (
    <div id="lich-thang" className="mystic-card p-4 sm:p-5 scroll-mt-20">
      <div className="flex items-center justify-between mb-3">
        <Link href={buildSlug(basePath, 1, prevMonth.mm, prevMonth.yyyy)} className={navBtn} aria-label="Tháng trước"><ChevronLeft size={20} /></Link>
        <p className="font-display font-bold text-xl text-parchment">Tháng {mm}, {yyyy}</p>
        <Link href={buildSlug(basePath, 1, nextMonth.mm, nextMonth.yyyy)} className={navBtn} aria-label="Tháng sau"><ChevronRight size={20} /></Link>
      </div>

      <details className="mb-3 text-sm">
        <summary className="cursor-pointer text-moon hover:text-parchment py-1">Chọn tháng khác</summary>
        <form onSubmit={handleJump} className="flex items-center gap-2 mt-2">
          <select value={jumpMonth} onChange={(e) => setJumpMonth(e.target.value)} aria-label="Tháng"
            className="bg-ink-soft border border-ink-line rounded-md px-2 py-2 text-parchment flex-1">
            {MONTH_OPTIONS.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
          <input type="number" value={jumpYear} onChange={(e) => setJumpYear(e.target.value)} aria-label="Năm"
            className="bg-ink-soft border border-ink-line rounded-md px-2 py-2 text-parchment w-24" />
          <button type="submit" className="btn-gold px-4 py-2 text-sm">Xem</button>
        </form>
      </details>

      {showQuality && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-parchment">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-jade inline-block" /> Hoàng đạo</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-moon inline-block" /> Hắc đạo</span>
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border-2 border-parchment inline-block" /> Hôm nay</span>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-moon mb-1.5">
        {THU_HEADER.map((t) => <div key={t}>{t}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const { lunarText, good } = info(d);
          const selected = d === dd;
          const isToday = todayKey === `${yyyy}-${mm}-${d}`;
          let tone = 'bg-white border border-ink-line text-parchment hover:border-parchment';
          if (showQuality && good === true) tone = 'bg-[#E4F1EB] border border-[#B6D8C9] text-parchment hover:border-jade';
          if (showQuality && good === false) tone = 'bg-[#ECEAE2] border border-ink-line text-parchment hover:border-moon';
          if (selected) tone = 'bg-lich border border-lich text-white';
          return (
            <Link
              key={d}
              href={buildSlug(basePath, d, mm, yyyy)}
              aria-current={selected ? 'date' : undefined}
              aria-label={`Ngày ${d} tháng ${mm}${good === true ? ', Hoàng đạo' : good === false ? ', Hắc đạo' : ''}${isToday ? ', hôm nay' : ''}`}
              className={`cal-cell relative flex flex-col items-center justify-center rounded-md transition-colors leading-none ${tone} ${isToday ? 'ring-2 ring-parchment ring-offset-1 ring-offset-white' : ''}`}
            >
              {showQuality && good !== null && (
                <span aria-hidden="true" className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${good ? (selected ? 'bg-white' : 'bg-jade') : (selected ? 'border border-white' : 'border-[1.5px] border-moon')}`} />
              )}
              <span className="text-base sm:text-lg font-bold">{d}</span>
              <span className={`text-[11px] sm:text-xs mt-1 ${selected ? 'text-white/90' : 'text-moon'}`}>{lunarText}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
