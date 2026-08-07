import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TuViWeekDashboard from '../../components/TuViWeekDashboard';
import MysticLoader from '../../components/MysticLoader';
import { buildWeekDashboard } from '../../lib/tuViDashboard';
import { getISOWeekInfo } from '../../lib/weekUtils';
import { getHubContentPreview } from '../../lib/sanity';

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticProps() {
  const preview = await getHubContentPreview('tu-vi');
  return { props: { ...preview }, revalidate: 86400 };
}

export default function TuViTuanIndex({ dictionaryPreview, guidePreview }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const today = new Date();
    const { week, year } = getISOWeekInfo(today.getDate(), today.getMonth() + 1, today.getFullYear());
    setDashboard(buildWeekDashboard(week, year));
  }, []);

  if (!dashboard) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang lập vận trình tuần này..." />
        <Footer />
      </>
    );
  }

  const rangeStr = `${pad(dashboard.monday.dd)}/${pad(dashboard.monday.mm)} - ${pad(dashboard.sunday.dd)}/${pad(dashboard.sunday.mm)}/${dashboard.sunday.yyyy}`;

  return (
    <>
      <Head>
        <title>Tử Vi Tuần {dashboard.week} Năm {dashboard.year} (Từ {rangeStr}) — TriMenh</title>
        <meta name="description" content={`Tử vi tuần ${rangeStr}: tổng quan, chỉ số vận trình, ngày đẹp nhất, vận trình 12 con giáp.`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi tuần" />
        <TuViWeekDashboard {...dashboard} dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
      </main>
      <Footer />
    </>
  );
}
