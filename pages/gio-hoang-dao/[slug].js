import Head from 'next/head';
import { Clock3 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import HubDayLinks from '../../components/HubDayLinks';
import { getChiNgay, getGioHoangDao } from '../../lib/gioHoangDao';

const SLUG_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

export async function getStaticPaths() {
  const paths = [];
  const today = new Date();
  for (let i = -5; i <= 25; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    paths.push({ params: { slug: `ngay-${dd}-thang-${mm}-nam-${d.getFullYear()}` } });
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const m = params.slug.match(SLUG_RE);
  if (!m) return { notFound: true };
  const [, dd, mm, yyyy] = m.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };

  const chiNgay = getChiNgay(dd, mm, yyyy);
  const gioList = getGioHoangDao(dd, mm, yyyy);

  return { props: { dd, mm, yyyy, chiNgay, gioList }, revalidate: 2592000 };
}

export default function GioHoangDaoResult({ dd, mm, yyyy, chiNgay, gioList }) {
  const title = `Giờ Hoàng Đạo ngày ${dd}/${mm}/${yyyy} — Ngày ${chiNgay}`;
  const desc = `Danh sách 6 giờ Hoàng đạo tốt trong ngày ${dd}/${mm}/${yyyy} (ngày ${chiNgay}), phù hợp xuất hành, khai trương, ký kết hợp đồng.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Clock3 size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="grid md:grid-cols-[340px_1fr] gap-6 items-start">
          <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />

          <div className="space-y-6 min-w-0">
            <div className="mystic-card p-6">
              <p className="text-moon mb-4">6 khung giờ Hoàng đạo tốt trong ngày:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {gioList.map((g) => (
                  <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-3 border border-ink-line">
                    <span className="text-gold-soft font-display text-lg">Giờ {g.chi}</span>
                    <span className="text-moon text-sm">{g.khung}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdSlot label="Ad slot — giờ hoàng đạo" />
            <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="gio-hoang-dao" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
