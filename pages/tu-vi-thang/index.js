import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import TuViMonthDashboard from '../../components/TuViMonthDashboard';
import MysticLoader from '../../components/MysticLoader';
import { buildMonthDashboard } from '../../lib/tuViDashboard';
import { getHubContentPreview } from '../../lib/content';

export async function getStaticProps() {
  const preview = await getHubContentPreview('tu-vi');
  return { props: { ...preview }, revalidate: 86400 };
}

export default function TuViThangIndex({ dictionaryPreview, guidePreview }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const today = new Date();
    setDashboard(buildMonthDashboard(today.getMonth() + 1, today.getFullYear()));
  }, []);

  if (!dashboard) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập vận trình tháng này..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Tử Vi Tháng ${dashboard.mm} Năm ${dashboard.yyyy} — TriMenh`}</title>
        <meta name="description" content={`Tử vi tháng ${dashboard.mm}/${dashboard.yyyy}: tổng quan, timeline theo tuần, ngày đẹp nhất, vận trình 12 con giáp.`} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi tháng" />
        <TuViMonthDashboard {...dashboard} dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </main>
        <SidebarTools seed="tu-vi-thang-index" />
      </div>
      <Footer />
    </>
  );
}
