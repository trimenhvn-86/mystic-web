import Head from 'next/head';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import HubDayLinks from '../../components/HubDayLinks';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay } from '../../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities, getLoaiNgay } from '../../lib/dayQuality';
import { getGioHoangDao } from '../../lib/gioHoangDao';
import { getNapAmByCanChi } from '../../lib/nguHanh';
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
  const loaiNgay = getLoaiNgay(sao);
  const activities = getSuggestedActivities(truc);
  const gioHoangDao = getGioHoangDao(dd, mm, yyyy);
  const napAmNgay = getNapAmByCanChi(canChiNgay);
  const rating = getDayRating(truc);

  return {
    props: { dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, loaiNgay, activities, gioHoangDao, napAmNgay, rating },
    revalidate: 2592000
  };
}

export default function NgayHoangDaoResult({ dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, loaiNgay, activities, gioHoangDao, napAmNgay, rating }) {
  const isGoodDay = activities.isGoodDay;
  const title = isGoodDay
    ? `Ngày ${dd}/${mm}/${yyyy} LÀ Ngày Hoàng Đạo`
    : `Ngày ${dd}/${mm}/${yyyy} KHÔNG phải Ngày Hoàng Đạo`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}/${lunar.year}) ${isGoodDay ? 'là' : 'không phải'} ngày Hoàng đạo. Trực ${truc}, Sao ${sao}, loại ngày ${loaiNgay}, mức độ phù hợp ${rating.score}/100.`;

  return (
    <>
      <Head>
        <title>{title} — TriMenh</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={26} className="text-gold" />
        </div>
        <h1 className={`font-display text-2xl sm:text-3xl mb-8 text-center ${isGoodDay ? 'text-jade' : 'text-vermilion'}`}>{title}</h1>

        <div className="grid md:grid-cols-[340px_1fr] gap-6 items-start">
          <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />

          <div className="space-y-6 min-w-0">
            {/* Danh gia nhanh */}
            <div className="mystic-card p-6">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={i <= rating.stars ? 'text-gold' : 'text-ink-line'}>★</span>
                ))}
              </div>
              <p className="font-display text-xl text-gold-soft mb-1">{rating.label}</p>
              <p className="text-sm text-moon">Mức độ phù hợp: <strong className="text-parchment">{rating.score}/100</strong> (chỉ số nội bộ TriMenh, tổng hợp từ Trực, Sao, Ngũ hành)</p>
            </div>

            {/* Vi sao la hoang dao */}
            <div className="mystic-card p-6">
              <h2 className="font-display text-lg text-parchment mb-3">Vì sao {isGoodDay ? 'là' : 'không phải'} ngày Hoàng Đạo?</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <p className="text-moon">Loại ngày: <strong className="text-parchment">{loaiNgay}</strong></p>
                <p className="text-moon">Sao: <strong className="text-parchment">{sao}</strong></p>
                <p className="text-moon">Trực: <strong className="text-parchment">{truc}</strong></p>
                {napAmNgay && <p className="text-moon">Ngũ hành: <strong className="text-parchment">{napAmNgay.napAm}</strong></p>}
              </div>
            </div>

            {/* Gio hoang dao */}
            <div className="mystic-card p-6">
              <h2 className="font-display text-lg text-parchment mb-3">Giờ Hoàng Đạo trong ngày</h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {gioHoangDao.map((g) => (
                  <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-2.5 border border-ink-line">
                    <span className="text-gold-soft font-display">Giờ {g.chi}</span>
                    <span className="text-moon text-sm">{g.khung}</span>
                  </div>
                ))}
              </div>
            </div>

            <AdSlot label="Ad slot — ngày hoàng đạo" />

            {/* Nen lam / kieng ky */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="mystic-card p-5 border-jade/30">
                <p className="text-jade font-semibold mb-2">Nên làm</p>
                <ul className="text-sm space-y-1 text-parchment/85">
                  {activities.nenLam.map((v) => <li key={v}>✓ {v}</li>)}
                </ul>
              </div>
              <div className="mystic-card p-5 border-vermilion/30">
                <p className="text-vermilion font-semibold mb-2">Nên tránh</p>
                <ul className="text-sm space-y-1 text-parchment/70">
                  {activities.kiengKy.map((v) => <li key={v}>✗ {v}</li>)}
                </ul>
              </div>
            </div>

            <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="ngay-hoang-dao" />
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
