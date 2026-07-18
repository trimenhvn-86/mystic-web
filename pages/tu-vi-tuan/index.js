import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TuViWeekDashboard from '../../components/TuViWeekDashboard';
import { buildWeekDashboard } from '../../lib/tuViDashboard';
import { getISOWeekInfo } from '../../lib/weekUtils';
import { getHubContentPreview } from '../../lib/sanity';

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticProps() {
  const today = new Date();
  const { week, year } = getISOWeekInfo(today.getDate(), today.getMonth() + 1, today.getFullYear());
  const dashboard = buildWeekDashboard(week, year);
  const preview = await getHubContentPreview('tu-vi');
  return { props: { ...dashboard, ...preview }, revalidate: 86400 };
}

export default function TuViTuanIndex(props) {
  const rangeStr = `${pad(props.monday.dd)}/${pad(props.monday.mm)} - ${pad(props.sunday.dd)}/${pad(props.sunday.mm)}/${props.sunday.yyyy}`;
  return (
    <>
      <Head>
        <title>Tử Vi Tuần {props.week} Năm {props.year} (Từ {rangeStr}) — TriMenh</title>
        <meta name="description" content={`Tử vi tuần ${rangeStr}: tổng quan, chỉ số vận trình, ngày đẹp nhất, vận trình 12 con giáp.`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi tuần" />
                <TuViWeekDashboard {...props} />
      </main>
      <Footer />
    </>
  );
}
