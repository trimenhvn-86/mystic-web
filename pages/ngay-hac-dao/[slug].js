import Head from 'next/head';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import CalendarSheet from '../../components/CalendarSheet';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay, jdFromDate, jdToDate } from '../../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities } from '../../lib/dayQuality';
import { getDayRating } from '../../lib/dayRating';

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

// Tim ngay Hoang dao gan nhat (trong vong 14 ngay tiep theo) de goi y thay the
function findNextGoodDay(dd, mm, yyyy) {
  const startJd = jdFromDate(dd, mm, yyyy);
  for (let i = 1; i <= 14; i++) {
    const [d2, m2, y2] = jdToDate(startJd + i);
    const lunar2 = convertSolar2Lunar(d2, m2, y2);
    const truc2 = getTruc(d2, m2, y2, lunar2.month);
    const act2 = getSuggestedActivities(truc2);
    if (act2.isGoodDay) return { dd: d2, mm: m2, yyyy: y2 };
  }
  return null;
}

export async function getStaticProps({ params }) {
  const m = params.slug.match(SLUG_RE);
  if (!m) return { notFound: true };
  const [, dd, mm, yyyy] = m.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };

  const lunar = convertSolar2Lunar(dd, mm, yyyy);
  const canChiNam = getCanChiNam(lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const sao = getSao28(dd, mm, yyyy);
  const activities = getSuggestedActivities(truc);
  const rating = getDayRating(truc);
  const nextGoodDay = activities.isGoodDay ? null : findNextGoodDay(dd, mm, yyyy);

  return {
    props: { dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, rating, nextGoodDay },
    revalidate: 86400
  };
}

export default function NgayHacDaoResult({ dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, rating, nextGoodDay }) {
  const isBadDay = !activities.isGoodDay;
  const title = isBadDay
    ? `Ngày ${dd}/${mm}/${yyyy} LÀ Ngày Hắc Đạo`
    : `Ngày ${dd}/${mm}/${yyyy} KHÔNG phải Ngày Hắc Đạo`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}/${lunar.year}) ${isBadDay ? 'là' : 'không phải'} ngày Hắc đạo. Trực ${truc}, Sao ${sao}.`;

  return (
    <>
      <Head>
        <title>{title} — TriMenh</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-gold" />
        </div>
        <h1 className={`font-display text-2xl sm:text-3xl mb-8 text-center ${isBadDay ? 'text-vermilion' : 'text-jade'}`}>{title}</h1>

        <div className="grid md:grid-cols-[260px_1fr] gap-6 items-start">
          <CalendarSheet dd={dd} mm={mm} yyyy={yyyy} lunar={lunar} canChiNgay={canChiNgay} isGoodDay={!isBadDay} />

          <div className="space-y-6 min-w-0">
            <div className="mystic-card p-6">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={i <= rating.stars ? 'text-gold' : 'text-ink-line'}>★</span>
                ))}
              </div>
              <p className={`font-display text-xl mb-1 ${isBadDay ? 'text-vermilion' : 'text-jade'}`}>{rating.label}</p>
              <p className="text-sm text-moon">Năm {canChiNam} — Ngày {canChiNgay} — Trực <strong className="text-parchment">{truc}</strong> — Sao <strong className="text-parchment">{sao}</strong></p>
            </div>

            {isBadDay ? (
              <div className="mystic-card p-6 border-vermilion/30">
                <p className="text-vermilion font-semibold mb-2">Nên tránh trong hôm nay</p>
                <ul className="text-sm space-y-1 text-parchment/85">
                  {activities.kiengKy.map((v) => <li key={v}>✗ {v}</li>)}
                </ul>
                {nextGoodDay && (
                  <p className="text-sm text-moon mt-4 pt-4 mystic-divider">
                    Ngày Hoàng Đạo gần nhất:{' '}
                    <Link href={`/ngay-hoang-dao/ngay-${pad(nextGoodDay.dd)}-thang-${pad(nextGoodDay.mm)}-nam-${nextGoodDay.yyyy}`} className="text-gold-soft hover:underline">
                      {pad(nextGoodDay.dd)}/{pad(nextGoodDay.mm)}/{nextGoodDay.yyyy}
                    </Link>
                  </p>
                )}
              </div>
            ) : (
              <div className="mystic-card p-6 border-jade/30">
                <p className="text-jade font-semibold mb-2">Đây thực ra là ngày Hoàng Đạo — có thể làm</p>
                <ul className="text-sm space-y-1 text-parchment/85">
                  {activities.nenLam.map((v) => <li key={v}>✓ {v}</li>)}
                </ul>
                <Link href={`/ngay-hoang-dao/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="inline-block text-sm text-gold-soft hover:underline mt-4">
                  Xem chi tiết ngày Hoàng đạo này →
                </Link>
              </div>
            )}

            <AdSlot label="Ad slot — ngày hắc đạo" />

            <div>
              <p className="text-sm text-moon mb-3">Xem thêm:</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/xem-ngay-tot/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt chi tiết</Link>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-moon/50 mt-8 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
