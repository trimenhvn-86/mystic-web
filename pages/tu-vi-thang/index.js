import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TuViMonthDashboard from '../../components/TuViMonthDashboard';
import { buildMonthDashboard } from '../../lib/tuViDashboard';
import { getHubContentPreview } from '../../lib/sanity';

export async function getStaticProps() {
  const today = new Date();
  const mm = today.getMonth() + 1, yyyy = today.getFullYear();
  const dashboard = buildMonthDashboard(mm, yyyy);
  const preview = await getHubContentPreview('tu-vi');
  return { props: { ...dashboard, ...preview }, revalidate: 86400 };
}

export default function TuViThangIndex(props) {
  return (
    <>
      <Head>
        <title>Tử Vi Tháng {props.mm} Năm {props.yyyy} — TriMenh</title>
        <meta name="description" content={`Tử vi tháng ${props.mm}/${props.yyyy}: tổng quan, timeline theo tuần, ngày đẹp nhất, vận trình 12 con giáp.`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi tháng" />
                <TuViMonthDashboard {...props} />
      </main>
      <Footer />
    </>
  );
}
