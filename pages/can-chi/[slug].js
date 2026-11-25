import Head from 'next/head';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import MiniCalendar from '../../components/MiniCalendar';
import HubDayLinks from '../../components/HubDayLinks';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay, getCanChiThang, jdFromDate, jdToDate } from '../../lib/lunar';
import { getNapAmByCanChi } from '../../lib/nguHanh';
import { getVietnamNow } from '../../lib/vnDate';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import { getHubContentPreview } from '../../lib/content';
import { FAQ_CAN_CHI } from '../../content/faq-data';

const SLUG_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticPaths() {
  const paths = [];
  const today = getVietnamNow();
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
  const canChiThang = getCanChiThang(lunar.month, lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const napAmNam = getNapAmByCanChi(canChiNam);
  const napAmThang = getNapAmByCanChi(canChiThang);
  const napAmNgay = getNapAmByCanChi(canChiNgay);
  const preview = await getHubContentPreview('lich-ngay-tot');
  const jd = jdFromDate(dd, mm, yyyy);
  const [prevDd, prevMm, prevYyyy] = jdToDate(jd - 1);
  const [nextDd, nextMm, nextYyyy] = jdToDate(jd + 1);

  return {
    props: {
      dd, mm, yyyy, lunar, canChiNam, canChiThang, canChiNgay, napAmNam, napAmThang, napAmNgay,
      prevDate: { dd: prevDd, mm: prevMm, yyyy: prevYyyy },
      nextDate: { dd: nextDd, mm: nextMm, yyyy: nextYyyy },
      ...preview
    },
    revalidate: 2592000
  };
}

function CanChiCard({ label, canChi, napAm }) {
  return (
    <div className="mystic-card p-5 text-center">
      <p className="text-xs text-moon mb-2">{label}</p>
      <p className="font-display text-2xl text-gold-soft mb-1">{canChi}</p>
      {napAm && <p className="text-sm text-moon/70">{napAm.napAm} ({napAm.hanh})</p>}
    </div>
  );
}

export default function CanChiResult({ dd, mm, yyyy, lunar, canChiNam, canChiThang, canChiNgay, napAmNam, napAmThang, napAmNgay, prevDate, nextDate, dictionaryPreview, guidePreview }) {
  const title = `Can Chi ngày ${dd}/${mm}/${yyyy} — Ngày ${canChiNgay}`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}/${lunar.year}): Năm ${canChiNam}, Tháng ${canChiThang}, Ngày ${canChiNgay}.`;
  const summary = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}${lunar.leap ? ' nhuận' : ''}/${lunar.year}) mang Can Chi Năm ${canChiNam}, Tháng ${canChiThang}, Ngày ${canChiNgay}${napAmNgay ? ` — Ngũ hành ngày thuộc ${napAmNgay.hanh} (${napAmNgay.napAm})` : ''}.`;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Lịch & Ngày Tốt', href: '/lich-ngay-tot' }, { label: 'Can Chi', href: '/can-chi' }]} current={`Ngày ${dd}/${mm}/${yyyy}`} />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-4">{title}</h1>
        <p className="text-moon/80 max-w-2xl mb-8 leading-relaxed">{summary}</p>

        <div className="grid md:grid-cols-[340px_1fr] gap-6 items-start">
          <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />

          <div className="space-y-6 min-w-0">
            <div className="grid sm:grid-cols-3 gap-4">
              <CanChiCard label="Năm" canChi={canChiNam} napAm={napAmNam} />
              <CanChiCard label="Tháng" canChi={canChiThang} napAm={napAmThang} />
              <CanChiCard label="Ngày" canChi={canChiNgay} napAm={napAmNgay} />
            </div>

            <div className="mystic-card p-6 text-sm text-moon">
              Âm lịch: <strong className="text-parchment">{lunar.day}/{lunar.month}{lunar.leap ? ' (nhuận)' : ''}/{lunar.year}</strong>
            </div>

            <MiniCalendar dd={dd} mm={mm} yyyy={yyyy} basePath="/can-chi" showQuality />

            <AdSlot label="Ad slot — can chi" />

            <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="can-chi" />

            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/can-chi/ngay-${pad(prevDate.dd)}-thang-${pad(prevDate.mm)}-nam-${prevDate.yyyy}`} className="text-moon hover:text-gold-soft">← Ngày trước</Link>
              <Link href={`/can-chi/ngay-${pad(nextDate.dd)}-thang-${pad(nextDate.mm)}-nam-${nextDate.yyyy}`} className="text-moon hover:text-gold-soft">Ngày sau →</Link>
            </div>

            <FaqSection faqs={FAQ_CAN_CHI} />
            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>
        </div>
      </main>
        <SidebarTools seed="can-chi-slug" />
      </div>
      <Footer />
    </>
  );
}
