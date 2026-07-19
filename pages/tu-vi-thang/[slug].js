import Head from 'next/head';
import Link from 'next/link';
import { Sun } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuViMonthDashboard from '../../components/TuViMonthDashboard';
import { buildMonthDashboard } from '../../lib/tuViDashboard';
import { getTuViThang } from '../../lib/tuViHomNay';
import { SLUG_TO_CHI, CHI_SLUG } from '../../lib/chiSlug';
import ConGiapLinks from '../../components/ConGiapLinks';
import { getHubContentPreview } from '../../lib/sanity';
import { getVietnamNow } from '../../lib/vnDate';

const MONTH_RE = /^thang-(\d{1,2})-nam-(\d{4})$/;

export async function getStaticPaths() {
  const paths = Object.keys(SLUG_TO_CHI).map((slug) => ({ params: { slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const monthMatch = slug.match(MONTH_RE);
  if (monthMatch) {
    const mm = Number(monthMatch[1]);
    const yyyy = Number(monthMatch[2]);
    if (mm < 1 || mm > 12) return { notFound: true };
    const dashboard = buildMonthDashboard(mm, yyyy);
    const preview = await getHubContentPreview('tu-vi');
    return { props: { type: 'thang', ...dashboard, ...preview }, revalidate: 86400 };
  }

  const chi = SLUG_TO_CHI[slug];
  if (chi) {
    const today = getVietnamNow();
    const data = getTuViThang(today.getMonth() + 1, today.getFullYear(), chi);
    return { props: { type: 'con-giap', data }, revalidate: 86400 };
  }

  return { notFound: true };
}

export default function TuViThangSlug(props) {
  if (props.type === 'thang') {
    return (
      <>
        <Head>
          <title>Tử Vi Tháng {props.mm} Năm {props.yyyy} — TriMenh</title>
          <meta name="description" content={`Tử vi tháng ${props.mm}/${props.yyyy}: tổng quan, timeline theo tuần, ngày đẹp nhất, vận trình 12 con giáp.`} />
        </Head>
        <Header />
        <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
          <TuViMonthDashboard {...props} />
        </main>
        <Footer />
      </>
    );
  }

  const { data } = props;
  const title = `Tử Vi Tuổi ${data.conGiap} Tháng ${data.thang}/${data.nam} — TriMenh`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`Tử vi tuổi ${data.conGiap} tháng ${data.thang}/${data.nam}: tổng quan, công danh, tài lộc, tình duyên, màu may mắn.`} />
      </Head>
      <Header />
      <main className="max-w-xl mx-auto px-5 py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sun size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }, { label: 'Tử vi tháng', href: '/tu-vi-thang' }]} current={`Tuổi ${data.conGiap}`} />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tuổi {data.conGiap}</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Tháng {data.thang}/{data.nam} — Mệnh {data.hanh}</p>
        <div className="mystic-card p-6 space-y-4">
          <div>
            <p className="text-gold-soft font-semibold mb-1">Tổng quan tháng</p>
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
            Màu may mắn tháng này: <strong className="text-parchment">{data.mauMayMan}</strong>
          </div>
        </div>
        <AdSlot label="Ad slot — tử vi tháng" className="mt-6" />
        <ConGiapLinks basePath="/tu-vi-thang" exclude={CHI_SLUG[data.conGiap]} />
        <Link href="/tu-vi-thang" className="block text-center text-sm text-moon hover:text-gold-soft mt-6">← Xem đầy đủ Tử vi tháng này</Link>
      </main>
      <Footer />
    </>
  );
}
