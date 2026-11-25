import { useState } from 'react';
import { useRouter } from 'next/router';
import { CalendarDays, Layers, Repeat, Hash } from 'lucide-react';

function pad(n) { return String(n).padStart(2, '0'); }

const TABS = [
  { id: 'ngay', label: 'Xem ngày tốt', icon: CalendarDays },
  { id: 'menh', label: 'Tra mệnh', icon: Layers },
  { id: 'lich', label: 'Đổi lịch', icon: Repeat },
  { id: 'so', label: 'Thần số học', icon: Hash }
];

/** Khối tra cứu đầu trang chủ: chọn việc, nhập một thông tin, sang thẳng trang kết quả. */
export default function HeroLookup({ todayIso, defaultYear }) {
  const router = useRouter();
  const [tab, setTab] = useState('ngay');
  const [date, setDate] = useState(todayIso);
  const [year, setYear] = useState(String(defaultYear));
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  function dateSlug(iso) {
    const [y, m, d] = iso.split('-');
    return `ngay-${pad(d)}-thang-${pad(m)}-nam-${y}`;
  }

  function submit(e) {
    e.preventDefault();
    setErr('');
    if (tab === 'ngay' || tab === 'lich') {
      if (!date) { setErr('Chọn ngày cần xem.'); return; }
      router.push(`/${tab === 'ngay' ? 'xem-ngay-tot' : 'doi-lich-am-duong'}/${dateSlug(date)}`);
    } else if (tab === 'menh') {
      const y = parseInt(year, 10);
      if (!y || y < 1900 || y > 2100) { setErr('Nhập năm sinh từ 1900 đến 2100.'); return; }
      router.push(`/${y}-menh-gi`);
    } else {
      if (!dob || !name.trim()) { setErr('Nhập đủ ngày sinh và họ tên.'); return; }
      const [y, m, d] = dob.split('-');
      const q = new URLSearchParams({ dd: String(parseInt(d, 10)), mm: String(parseInt(m, 10)), yyyy: y, hoTen: name.trim() });
      router.push(`/than-so-hoc?${q.toString()}`);
    }
  }

  const field = 'w-full bg-white border border-ink-line rounded-md px-3.5 py-3 text-base text-parchment focus:border-lich';
  const labels = { ngay: 'Chọn ngày cần xem', lich: 'Chọn ngày dương lịch', menh: 'Năm sinh của bạn' };
  const buttons = { ngay: 'Xem ngày này', lich: 'Đổi sang âm lịch', menh: 'Tra mệnh', so: 'Lập biểu đồ' };

  return (
    <div className="mystic-card overflow-hidden">
      <div role="tablist" aria-label="Chọn việc cần tra" className="grid grid-cols-4 border-b border-ink-line">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button key={t.id} role="tab" aria-selected={on} type="button" onClick={() => { setTab(t.id); setErr(''); }}
              className={`min-h-[3.25rem] px-1 py-2 text-[13px] sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-b-2 -mb-px transition-colors ${on ? 'border-lich text-parchment bg-white' : 'border-transparent text-moon bg-ink-soft hover:text-parchment'}`}>
              <Icon size={16} aria-hidden="true" /><span>{t.label}</span>
            </button>
          );
        })}
      </div>
      <form onSubmit={submit} className="p-4 sm:p-5" role="tabpanel">
        {(tab === 'ngay' || tab === 'lich') && (
          <label className="block text-sm text-moon mb-3">{labels[tab]}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1.5`} />
          </label>
        )}
        {tab === 'menh' && (
          <label className="block text-sm text-moon mb-3">{labels.menh}
            <input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ví dụ: 1995" className={`${field} mt-1.5`} />
          </label>
        )}
        {tab === 'so' && (
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <label className="block text-sm text-moon">Ngày sinh
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${field} mt-1.5`} />
            </label>
            <label className="block text-sm text-moon">Họ và tên đầy đủ
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className={`${field} mt-1.5`} />
            </label>
          </div>
        )}
        {err && <p role="alert" className="text-sm text-vermilion mb-3">{err}</p>}
        <button type="submit" className="btn-gold w-full py-3.5 text-base">{buttons[tab]}</button>
      </form>
    </div>
  );
}
