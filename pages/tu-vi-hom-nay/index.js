import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import TuViDayDashboard from '../../components/TuViDayDashboard';
import MysticLoader from '../../components/MysticLoader';
import { buildDayDashboard } from '../../lib/tuViDashboard';
import { jdFromDate, jdToDate } from '../../lib/lunar';
import { getHubContentPreview } from '../../lib/content';

function pad(n) { return String(n).padStart(2, '0'); }
function slugOf(dd, mm, yyyy) { return `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

// Chi fetch Tu dien/Cam nang (khong phu thuoc ngay) o server. Du lieu Tu vi hom nay tinh
// THANG TREN TRINH DUYET nguoi dung (giong Doi lich am duong) de luon dung ngay that, khong cache.
export async function getStaticProps() {
  const preview = await getHubContentPreview('tu-vi');
  return { props: { ...preview }, revalidate: 86400 };
}

export default function TuViHomNayIndex({ dictionaryPreview, guidePreview }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const today = new Date();
    const dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
    const dashboard = buildDayDashboard(dd, mm, yyyy);
    const jd = jdFromDate(dd, mm, yyyy);
    const [pd, pm, py] = jdToDate(jd - 1);
    const [nd, nm, ny] = jdToDate(jd + 1);
    setData({
      dashboard,
      dateStr: `${dd}/${mm}/${yyyy}`,
      prevSlug: slugOf(pd, pm, py),
      nextSlug: slugOf(nd, nm, ny)
    });
  }, []);

  if (!data) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập vận trình hôm nay..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Tử Vi Hôm Nay Ngày ${data.dashboard.dd} Tháng ${data.dashboard.mm} Năm ${data.dashboard.yyyy} (${data.dateStr}) — TriMenh`}</title>
        <meta name="description" content={`Tử vi hôm nay ${data.dateStr}: tổng quan, chỉ số vận trình, giờ may mắn, màu sắc, tuổi hợp và vận trình đủ 12 con giáp.`} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi hôm nay" />
        <TuViDayDashboard {...data} dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </main>
        <SidebarTools seed="tu-vi-hom-nay-index" />
      </div>
      <Footer />
    </>
  );
}
