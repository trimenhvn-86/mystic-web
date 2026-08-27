import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Sun } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuViDayDashboard from '../../components/TuViDayDashboard';
import { buildDayDashboard } from '../../lib/tuViDashboard';
import { getTuViHomNay } from '../../lib/tuViHomNay';
import { jdFromDate, jdToDate } from '../../lib/lunar';
import { SLUG_TO_CHI, CHI_SLUG } from '../../lib/chiSlug';
import { getHubContentPreview } from '../../lib/sanity';
import ConGiapLinks from '../../components/ConGiapLinks';
import FaqSection from '../../components/FaqSection';
import HubContentPreview from '../../components/HubContentPreview';
import MysticLoader from '../../components/MysticLoader';
import { getVietnamNow } from '../../lib/vnDate';
import { FAQ_TU_VI_NGAY } from '../../content/faq-data';

const DATE_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

function pad(n) { return String(n).padStart(2, '0'); }
function slugOf(dd, mm, yyyy) { return `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

export async function getStaticPaths() {
  const paths = Object.keys(SLUG_TO_CHI).map((slug) => ({ params: { slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  // Truong hop 1: theo ngay cu the -> deterministic, khong bao gio doi, cache dai han an toan
  const dateMatch = slug.match(DATE_RE);
  if (dateMatch) {
    const [, dd, mm, yyyy] = dateMatch.map(Number);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };
    const dashboard = buildDayDashboard(dd, mm, yyyy);
    const jd = jdFromDate(dd, mm, yyyy);
    const [pd, pm, py] = jdToDate(jd - 1);
    const [nd, nm, ny] = jdToDate(jd + 1);
    const preview = await getHubContentPreview('tu-vi');
    return {
      props: {
        type: 'ngay',
        dashboard,
        dateStr: `${dd}/${mm}/${yyyy}`,
        prevSlug: slugOf(pd, pm, py),
        nextSlug: slugOf(nd, nm, ny),
        ...preview
      },
      revalidate: 2592000
    };
  }

  // Truong hop 2: theo con giap - phan server CHI tra ve chiSlug (khong phu thuoc ngay nua,
  // du lieu "hom nay" da chuyen sang tinh tren trinh duyet o buoc sua loi ngay thang truoc do),
  // nen an toan de cache dai han - giam manh so lan goi Sanity (tu moi luot xem xuong 1 lan/ngay).
  const chi = SLUG_TO_CHI[slug];
  if (chi) {
    const preview = await getHubContentPreview('tu-vi');
    return { props: { type: 'con-giap', chi, ...preview }, revalidate: 86400 };
  }

  return { notFound: true };
}

export default function TuViHomNaySlug(props) {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (props.type !== 'con-giap') return;
    const today = new Date();
    const data = getTuViHomNay(today.getDate(), today.getMonth() + 1, today.getFullYear(), props.chi);
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    setState({ data, dateStr });
  }, [props.type, props.chi]);

  if (props.type === 'ngay') {
    return (
      <>
        <Head>
          <title>Tử Vi Hôm Nay Ngày {props.dashboard.dd} Tháng {props.dashboard.mm} Năm {props.dashboard.yyyy} ({props.dateStr}) — TriMenh</title>
          <meta name="description" content={`Tử vi hôm nay ${props.dateStr}: tổng quan, chỉ số vận trình, giờ may mắn, màu sắc, tuổi hợp và vận trình đủ 12 con giáp.`} />
        </Head>
        <Header />
        <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
          <TuViDayDashboard {...props} />
        </main>
        <Footer />
      </>
    );
  }

  // type === 'con-giap' - du lieu "hom nay" tinh tren trinh duyet, hien loading cho toi khi xong
  const { dictionaryPreview, guidePreview } = props;

  if (!state) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập vận trình hôm nay..." />
        <Footer />
      </>
    );
  }

  const { data, dateStr } = state;
  const title = `Tử Vi Tuổi ${data.conGiap} Hôm Nay ${dateStr} — TriMenh`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`Tử vi tuổi ${data.conGiap} hôm nay ${dateStr}: công danh, tài lộc, tình duyên, màu may mắn.`} />
      </Head>
      <Header />
      <main className="max-w-xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sun size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }, { label: 'Tử vi hôm nay', href: '/tu-vi-hom-nay' }]} current={`Tuổi ${data.conGiap}`} />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tuổi {data.conGiap}</h1>
        <p className="text-moon/70 text-sm text-center mb-8">{dateStr} — Mệnh {data.hanh}</p>
        <div className="mystic-card p-6 space-y-4">
          <div>
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
            Màu may mắn hôm nay: <strong className="text-parchment">{data.mauMayMan}</strong>
          </div>
        </div>
        <AdSlot label="Ad slot — tử vi hôm nay" className="mt-6" />
        <ConGiapLinks basePath="/tu-vi-hom-nay" exclude={CHI_SLUG[data.conGiap]} />
        <Link href="/tu-vi-hom-nay" className="block text-center text-sm text-moon hover:text-gold-soft mt-6">← Xem đầy đủ Tử vi hôm nay</Link>

        <div className="mt-8">
          <FaqSection faqs={FAQ_TU_VI_NGAY} />
        </div>

        <div className="mt-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
