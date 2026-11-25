import Head from 'next/head';
import { isOutsideIndexWindow } from '../../lib/indexWindow';
import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import MiniCalendar from '../../components/MiniCalendar';
import HubDayLinks from '../../components/HubDayLinks';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import { getChiNgay, getGioHoangDao } from '../../lib/gioHoangDao';
import { jdFromDate, jdToDate } from '../../lib/lunar';
import { getHubContentPreview } from '../../lib/content';
import { getVietnamNow } from '../../lib/vnDate';
import { FAQ_GIO_HOANG_DAO } from '../../content/faq-data';

function pad(n) { return String(n).padStart(2, '0'); }

const SLUG_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

export async function getStaticPaths() {
  const paths = [];
  const today = getVietnamNow();
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
  const preview = await getHubContentPreview('lich-ngay-tot');
  const jd = jdFromDate(dd, mm, yyyy);
  const [prevDd, prevMm, prevYyyy] = jdToDate(jd - 1);
  const [nextDd, nextMm, nextYyyy] = jdToDate(jd + 1);

  return {
    props: {
      dd, mm, yyyy, chiNgay, gioList,
      prevDate: { dd: prevDd, mm: prevMm, yyyy: prevYyyy },
      nextDate: { dd: nextDd, mm: nextMm, yyyy: nextYyyy },
      ...preview
    },
    revalidate: 86400
  };
}

export default function GioHoangDaoResult({ dd, mm, yyyy, chiNgay, gioList, prevDate, nextDate, dictionaryPreview, guidePreview }) {
  const title = `Giờ Hoàng Đạo ngày ${dd}/${mm}/${yyyy} — Ngày ${chiNgay}`;
  const desc = `Danh sách 6 giờ Hoàng đạo tốt trong ngày ${dd}/${mm}/${yyyy} (ngày ${chiNgay}), phù hợp xuất hành, khai trương, ký kết hợp đồng.`;
  const summary = `Ngày ${dd}/${mm}/${yyyy} (ngày ${chiNgay}) có 6 khung giờ Hoàng đạo tốt, thuận lợi cho xuất hành, khai trương, ký kết hợp đồng. Giờ đầu tiên trong ngày là giờ ${gioList[0]?.chi} (${gioList[0]?.khung}).`;

  return (
    <>
      <Head>
        {isOutsideIndexWindow(dd, mm, yyyy) && <meta name="robots" content="noindex, follow" />}
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Lịch & Ngày Tốt', href: '/lich-ngay-tot' }, { label: 'Giờ hoàng đạo', href: '/gio-hoang-dao' }]} current={`Ngày ${dd}/${mm}/${yyyy}`} />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-4">{title}</h1>
        <p className="text-moon/80 max-w-2xl mb-8 leading-relaxed">{summary}</p>

        <div className="grid md:grid-cols-[340px_1fr] gap-6 items-start">
          <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />

          <div className="space-y-6 min-w-0">
            <div className="mystic-card p-6">
              <p className="text-moon mb-4">6 khung giờ Hoàng đạo tốt trong ngày:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {gioList.map((g) => (
                  <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-md px-4 py-3 border border-ink-line">
                    <span className="text-gold-soft font-display text-lg">Giờ {g.chi}</span>
                    <span className="text-moon text-sm">{g.khung}</span>
                  </div>
                ))}
              </div>
            </div>

            <MiniCalendar dd={dd} mm={mm} yyyy={yyyy} basePath="/gio-hoang-dao" showQuality />

            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/gio-hoang-dao/ngay-${pad(prevDate.dd)}-thang-${pad(prevDate.mm)}-nam-${prevDate.yyyy}`} className="text-moon hover:text-gold-soft">← Ngày trước</Link>
              <Link href={`/gio-hoang-dao/ngay-${pad(nextDate.dd)}-thang-${pad(nextDate.mm)}-nam-${nextDate.yyyy}`} className="text-moon hover:text-gold-soft">Ngày sau →</Link>
            </div>

            <AdSlot label="Ad slot — giờ hoàng đạo" />
            <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="gio-hoang-dao" />
            <FaqSection faqs={FAQ_GIO_HOANG_DAO} />
            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>
        </div>
      </main>
        <SidebarTools seed="gio-hoang-dao-slug" />
      </div>
      <Footer />
    </>
  );
}
