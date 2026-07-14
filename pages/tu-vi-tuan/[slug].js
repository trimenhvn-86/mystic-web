import Head from 'next/head';
import Link from 'next/link';
import { Sun } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuViWeekDashboard from '../../components/TuViWeekDashboard';
import { buildWeekDashboard } from '../../lib/tuViDashboard';
import { getTuViTuan } from '../../lib/tuViHomNay';
import { SLUG_TO_CHI, CHI_SLUG } from '../../lib/chiSlug';
import ConGiapLinks from '../../components/ConGiapLinks';
import { getHubContentPreview } from '../../lib/sanity';

const WEEK_RE = /^tuan-(\d{1,2})-nam-(\d{4})$/;

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticPaths() {
  const paths = Object.keys(SLUG_TO_CHI).map((slug) => ({ params: { slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const weekMatch = slug.match(WEEK_RE);
  if (weekMatch) {
    const week = Number(weekMatch[1]);
    const year = Number(weekMatch[2]);
    if (week < 1 || week > 53) return { notFound: true };
    const dashboard = buildWeekDashboard(week, year);
    const preview = await getHubContentPreview('tu-vi');
    return { props: { type: 'tuan', ...dashboard, ...preview }, revalidate: 86400 };
  }

  const chi = SLUG_TO_CHI[slug];
  if (chi) {
    const today = new Date();
    const data = getTuViTuan(today.getDate(), today.getMonth() + 1, today.getFullYear(), chi);
    const rangeStr = `${pad(data.tuNgay.dd)}/${pad(data.tuNgay.mm)} - ${pad(data.denNgay.dd)}/${pad(data.denNgay.mm)}/${data.denNgay.yyyy}`;
    return { props: { type: 'con-giap', data, rangeStr }, revalidate: 86400 };
  }

  return { notFound: true };
}

export default function TuViTuanSlug(props) {
  if (props.type === 'tuan') {
    return (
      <>
        <Head>
          <title>Tử Vi Tuần {props.week} Năm {props.year} (Từ {pad(props.monday.dd)}/{pad(props.monday.mm)} - {pad(props.sunday.dd)}/{pad(props.sunday.mm)}/{props.sunday.yyyy}) — TriMenh</title>
          <meta name="description" content={`Tử vi tuần ${props.week}/${props.year}: tổng quan, chỉ số vận trình, ngày đẹp nhất, vận trình 12 con giáp.`} />
        </Head>
        <Header />
        <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
          <TuViWeekDashboard {...props} />
        </main>
        <Footer />
      </>
    );
  }

  const { data, rangeStr } = props;
  const title = `Tử Vi Tuổi ${data.conGiap} Tuần Này (${rangeStr}) — TriMenh`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`Tử vi tuổi ${data.conGiap} tuần ${rangeStr}: tổng quan, công danh, tài lộc, tình duyên, màu may mắn.`} />
      </Head>
      <Header />
      <main className="max-w-xl mx-auto px-5 py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sun size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tuổi {data.conGiap}</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Tuần {rangeStr} — Mệnh {data.hanh}</p>
        <div className="mystic-card p-6 space-y-4">
          <div>
            <p className="text-gold-soft font-semibold mb-1">Tổng quan tuần</p>
            <p>{data.tongQuan}</p>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-gold-soft font-semibold mb-1">Công danh</p>
            <p>{data.congDanh}</p>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-gold-soft font-semibold mb-1">Tài lộc</p>
            <p>{data.taiLoc}</p>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-gold-soft font-semibold mb-1">Tình duyên</p>
            <p>{data.tinhDuyen}</p>
          </div>
          <div className="mystic-divider pt-4 text-sm text-moon">
            Màu may mắn tuần này: <strong className="text-parchment">{data.mauMayMan}</strong>
          </div>
        </div>
        <AdSlot label="Ad slot — tử vi tuần" className="mt-6" />
        <ConGiapLinks basePath="/tu-vi-tuan" exclude={CHI_SLUG[data.conGiap]} />
        <Link href="/tu-vi-tuan" className="block text-center text-sm text-moon hover:text-gold-soft mt-6">← Xem đầy đủ Tử vi tuần này</Link>
      </main>
      <Footer />
    </>
  );
}
