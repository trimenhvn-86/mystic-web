import Head from 'next/head';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TuViDayDashboard from '../../components/TuViDayDashboard';
import { buildDayDashboard } from '../../lib/tuViDashboard';
import { jdFromDate, jdToDate } from '../../lib/lunar';
import { getHubContentPreview } from '../../lib/sanity';
import { getVietnamNow } from '../../lib/vnDate';

function pad(n) { return String(n).padStart(2, '0'); }
function slugOf(dd, mm, yyyy) { return `ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`; }

export async function getStaticProps() {
  const today = getVietnamNow();
  const dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  const dashboard = buildDayDashboard(dd, mm, yyyy);
  const jd = jdFromDate(dd, mm, yyyy);
  const [pd, pm, py] = jdToDate(jd - 1);
  const [nd, nm, ny] = jdToDate(jd + 1);
  const preview = await getHubContentPreview('tu-vi');

  return {
    props: {
      dashboard,
      dateStr: `${dd}/${mm}/${yyyy}`,
      prevSlug: slugOf(pd, pm, py),
      nextSlug: slugOf(nd, nm, ny),
      ...preview
    },
    revalidate: 86400
  };
}

export default function TuViHomNayIndex(props) {
  return (
    <>
      <Head>
        <title>Tử Vi Hôm Nay Ngày {props.dashboard.dd} Tháng {props.dashboard.mm} Năm {props.dashboard.yyyy} ({props.dateStr}) — TriMenh</title>
        <meta name="description" content={`Tử vi hôm nay ${props.dateStr}: tổng quan, chỉ số vận trình, giờ may mắn, màu sắc, tuổi hợp và vận trình đủ 12 con giáp.`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[{ label: 'Tử Vi', href: '/tu-vi' }]} current="Tử vi hôm nay" />
                <TuViDayDashboard {...props} />
      </main>
      <Footer />
    </>
  );
}
