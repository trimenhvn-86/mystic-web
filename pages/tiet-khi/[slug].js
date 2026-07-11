import Head from 'next/head';
import Link from 'next/link';
import { Sun } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { getTietKhi, TIET_KHI, jdFromDate, jdToDate } from '../../lib/lunar';
import tietKhiMeaning from '../../content/lunar/tiet-khi-meaning.json';

const SLUG_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticPaths() {
  const paths = [];
  const today = new Date();
  for (let i = -5; i <= 25; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    paths.push({ params: { slug: `ngay-${pad(d.getDate())}-thang-${pad(d.getMonth() + 1)}-nam-${d.getFullYear()}` } });
  }
  return { paths, fallback: 'blocking' };
}

// Tim ngay bat dau cua tiet khi hien tai va tiet khi tiep theo (do lui/tien toi da 20 ngay)
function findTietKhiBoundaries(dd, mm, yyyy) {
  const jd = jdFromDate(dd, mm, yyyy);
  const current = getTietKhi(dd, mm, yyyy);

  let startJd = jd;
  for (let i = 1; i <= 20; i++) {
    const [d2, m2, y2] = jdToDate(jd - i);
    if (getTietKhi(d2, m2, y2) !== current) break;
    startJd = jd - i;
  }

  let nextTietKhi = null;
  let nextJd = null;
  for (let i = 1; i <= 20; i++) {
    const [d2, m2, y2] = jdToDate(jd + i);
    const t2 = getTietKhi(d2, m2, y2);
    if (t2 !== current) {
      nextTietKhi = t2;
      nextJd = jd + i;
      break;
    }
  }

  const [sd, sm, sy] = jdToDate(startJd);
  const nextDate = nextJd ? jdToDate(nextJd) : null;

  return {
    current,
    startDate: { dd: sd, mm: sm, yyyy: sy },
    next: nextTietKhi ? { name: nextTietKhi, date: { dd: nextDate[0], mm: nextDate[1], yyyy: nextDate[2] } } : null
  };
}

export async function getStaticProps({ params }) {
  const m = params.slug.match(SLUG_RE);
  if (!m) return { notFound: true };
  const [, dd, mm, yyyy] = m.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };

  const boundaries = findTietKhiBoundaries(dd, mm, yyyy);

  return { props: { dd, mm, yyyy, ...boundaries }, revalidate: 86400 };
}

export default function TietKhiResult({ dd, mm, yyyy, current, startDate, next }) {
  const title = `Ngày ${dd}/${mm}/${yyyy} thuộc Tiết Khí ${current}`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} thuộc Tiết Khí ${current} (${tietKhiMeaning[current] || ''}). Tiết khí bắt đầu từ ${pad(startDate.dd)}/${pad(startDate.mm)}/${startDate.yyyy}.`;

  return (
    <>
      <Head>
        <title>{title} — TriMenh</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sun size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="mystic-card p-6 text-center mb-6">
          <p className="text-xs text-moon uppercase mb-1">Tiết Khí hiện tại</p>
          <p className="font-display text-3xl text-gold-soft mb-2">{current}</p>
          <p className="text-parchment/85 mb-3">{tietKhiMeaning[current]}</p>
          <p className="text-sm text-moon">Bắt đầu từ: <strong className="text-parchment">{pad(startDate.dd)}/{pad(startDate.mm)}/{startDate.yyyy}</strong></p>
        </div>

        {next && (
          <div className="mystic-card p-6 text-center mb-6">
            <p className="text-xs text-moon uppercase mb-1">Tiết Khí tiếp theo</p>
            <p className="font-display text-xl text-gold-soft mb-1">{next.name}</p>
            <p className="text-sm text-moon">Dự kiến: <strong className="text-parchment">{pad(next.date.dd)}/{pad(next.date.mm)}/{next.date.yyyy}</strong></p>
          </div>
        )}

        <AdSlot label="Ad slot — tiết khí" className="mb-6" />

        <div>
          <p className="text-sm text-moon mb-3">Xem thêm:</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/can-chi/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem Can Chi</Link>
            <Link href={`/xem-ngay-tot/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
          </div>
        </div>

        <p className="text-xs text-moon/50 mt-6 text-center">
          * Tính theo công thức thiên văn xấp xỉ, có thể lệch 1 ngày ở đúng thời điểm chuyển tiết so với nguồn chính thức.
        </p>
      </main>
      <Footer />
    </>
  );
}
