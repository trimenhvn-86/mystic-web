import Head from 'next/head';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import MiniCalendar from '../../components/MiniCalendar';
import HubDayLinks from '../../components/HubDayLinks';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay, getCanChiThang } from '../../lib/lunar';
import { getNapAmByCanChi } from '../../lib/nguHanh';
import { getVietnamNow } from '../../lib/vnDate';

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

  return {
    props: { dd, mm, yyyy, lunar, canChiNam, canChiThang, canChiNgay, napAmNam, napAmThang, napAmNgay },
    revalidate: 2592000
  };
}

function CanChiCard({ label, canChi, napAm }) {
  return (
    <div className="mystic-card p-5 text-center">
      <p className="text-xs text-moon uppercase mb-2">{label}</p>
      <p className="font-display text-2xl text-gold-soft mb-1">{canChi}</p>
      {napAm && <p className="text-sm text-moon/70">{napAm.napAm} ({napAm.hanh})</p>}
    </div>
  );
}

export default function CanChiResult({ dd, mm, yyyy, lunar, canChiNam, canChiThang, canChiNgay, napAmNam, napAmThang, napAmNgay }) {
  const title = `Can Chi ngày ${dd}/${mm}/${yyyy} — Ngày ${canChiNgay}`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}/${lunar.year}): Năm ${canChiNam}, Tháng ${canChiThang}, Ngày ${canChiNgay}.`;
  const summary = `Ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}${lunar.leap ? ' nhuận' : ''}/${lunar.year}) mang Can Chi Năm ${canChiNam}, Tháng ${canChiThang}, Ngày ${canChiNgay}${napAmNgay ? ` — Ngũ hành ngày thuộc ${napAmNgay.hanh} (${napAmNgay.napAm})` : ''}.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Layers size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Lịch & Ngày Tốt', href: '/lich-ngay-tot' }, { label: 'Can Chi', href: '/can-chi' }]} current={`Ngày ${dd}/${mm}/${yyyy}`} />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-4 text-center">{title}</h1>
        <p className="text-moon/80 text-center max-w-2xl mx-auto mb-8 leading-relaxed">{summary}</p>

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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
