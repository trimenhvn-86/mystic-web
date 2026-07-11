import Head from 'next/head';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import CalendarImageCard from '../../components/CalendarImageCard';
import HubDayLinks from '../../components/HubDayLinks';
import DayRatingBox from '../../components/DayRatingBox';
import MauSoHomNay from '../../components/MauSoHomNay';
import MiniCalendar from '../../components/MiniCalendar';
import SidebarTools from '../../components/SidebarTools';
import FaqSection from '../../components/FaqSection';
import SeoContent from '../../components/SeoContent';
import { FAQ_DOI_LICH } from '../../content/faq-data';
import { convertSolar2Lunar, convertLunar2Solar, getCanChiNam, getCanChiNgay, jdFromDate, jdToDate } from '../../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities } from '../../lib/dayQuality';
import { getNapAmByCanChi } from '../../lib/nguHanh';
import { getDayRating } from '../../lib/dayRating';

const SOLAR_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;
const LUNAR_RE = /^am-ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

function pad(n) {
  return String(n).padStart(2, '0');
}

export async function getStaticPaths() {
  const paths = [];
  const today = new Date();
  for (let i = -5; i <= 25; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    paths.push({ params: { slug: `ngay-${dd}-thang-${mm}-nam-${d.getFullYear()}` } });
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  let solarMatch = slug.match(SOLAR_RE);
  let lunarMatch = slug.match(LUNAR_RE);

  let dd, mm, yyyy, lunar;

  if (solarMatch) {
    [, dd, mm, yyyy] = solarMatch.map(Number);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };
    lunar = convertSolar2Lunar(dd, mm, yyyy);
  } else if (lunarMatch) {
    let [, ld, lm, ly] = lunarMatch.map(Number);
    const solar = convertLunar2Solar(ld, lm, ly, 0);
    if (!solar) return { notFound: true };
    dd = solar.day; mm = solar.month; yyyy = solar.year;
    lunar = { day: ld, month: lm, year: ly, leap: 0 };
  } else {
    return { notFound: true };
  }

  const canChiNam = getCanChiNam(lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const sao = getSao28(dd, mm, yyyy);
  const activities = getSuggestedActivities(truc);
  const napAmNgay = getNapAmByCanChi(canChiNgay);
  const rating = getDayRating(truc);

  // Ngày trước / ngày sau (tính qua Julian Day cho chính xác qua các mốc cuối tháng)
  const jd = jdFromDate(dd, mm, yyyy);
  const prevJd = jd - 1;
  const nextJd = jd + 1;
  const [prevDd, prevMm, prevYyyy] = jdToDate(prevJd);
  const [nextDd, nextMm, nextYyyy] = jdToDate(nextJd);

  return {
    props: {
      dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, napAmNgay, rating,
      prevDate: { dd: prevDd, mm: prevMm, yyyy: prevYyyy },
      nextDate: { dd: nextDd, mm: nextMm, yyyy: nextYyyy }
    },
    revalidate: 86400
  };
}

export default function DoiLichResult({
  dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, napAmNgay, rating, prevDate, nextDate
}) {
  const title = `${dd}/${mm}/${yyyy} Dương lịch là ngày mấy Âm lịch? — Đổi Lịch Âm Dương`;
  const desc = `Ngày ${dd}/${mm}/${yyyy} Dương lịch tương ứng với ${lunar.day}/${lunar.month}${lunar.leap ? ' (nhuận)' : ''}/${lunar.year} Âm lịch, năm ${canChiNam}, ngày ${canChiNgay}, Trực ${truc}, Sao ${sao}.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:image" content={`https://trimenh.com/api/lich-anh?dd=${dd}&mm=${mm}&yyyy=${yyyy}`} />
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <CalendarDays size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="grid lg:grid-cols-[1fr_240px] gap-8">
          <div className="space-y-6 min-w-0">
            <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
              {/* Card thông tin chi tiết */}
              <div className="mystic-card p-6 grid sm:grid-cols-2 gap-4 text-center order-2 md:order-1">
                <div>
                  <p className="text-xs text-moon uppercase mb-1">Dương lịch</p>
                  <p className="text-2xl text-gold-soft font-display">{dd}/{mm}/{yyyy}</p>
                </div>
                <div>
                  <p className="text-xs text-moon uppercase mb-1">Âm lịch</p>
                  <p className="text-2xl text-gold-soft font-display">
                    {lunar.day}/{lunar.month}{lunar.leap ? ' (nhuận)' : ''}/{lunar.year}
                  </p>
                </div>
                <div className="sm:col-span-2 mystic-divider pt-4 grid sm:grid-cols-2 gap-3 text-left">
                  <p className="text-moon">Năm: <strong className="text-parchment">{canChiNam}</strong></p>
                  <p className="text-moon">Ngày: <strong className="text-parchment">{canChiNgay}</strong></p>
                  <p className="text-moon">Trực: <strong className="text-parchment">{truc}</strong></p>
                  <p className="text-moon">Sao: <strong className="text-parchment">{sao}</strong></p>
                  {napAmNgay && (
                    <p className="sm:col-span-2 text-moon">Ngũ hành ngày: <strong className="text-parchment">{napAmNgay.napAm}</strong> ({napAmNgay.hanh})</p>
                  )}
                </div>
              </div>

              {/* Hình tờ lịch */}
              <div className="order-1 md:order-2">
                <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />
              </div>
            </div>

            {/* Hôm nay có tốt không */}
            <DayRatingBox stars={rating.stars} label={rating.label} nenLam={activities.nenLam} kiengKy={activities.kiengKy} />

            {/* Hợp màu / hợp số */}
            {napAmNgay && <MauSoHomNay hanh={napAmNgay.hanh} mauHop={napAmNgay.mauHop} />}

            <AdSlot label="Ad slot — kết quả đổi lịch" />

            {/* Internal Link Engine */}
            <div>
              <p className="text-sm text-moon mb-3">Có thể bạn quan tâm:</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/xem-ngay-tot/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
                <Link href={`/gio-hoang-dao/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Giờ hoàng đạo</Link>
                <Link href={`/xem-ngay-tot/ngay-${pad(dd)}-thang-${pad(mm)}-nam-${yyyy}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày xuất hành / Lục Nhâm / Khổng Minh</Link>
                <Link href={`/${yyyy}-hop-tuoi-nao`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem tuổi hợp</Link>
                <Link href="/than-so-hoc" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Thần số học</Link>
                <Link href={`/${yyyy}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh ngũ hành</Link>
              </div>
            </div>

            <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="doi-lich-am-duong" />

            {/* Lich mini */}
            <MiniCalendar dd={dd} mm={mm} yyyy={yyyy} showQuality />

            {/* Dieu huong ngay truoc/sau/thang/nam */}
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/doi-lich-am-duong/ngay-${pad(prevDate.dd)}-thang-${pad(prevDate.mm)}-nam-${prevDate.yyyy}`} className="text-moon hover:text-gold-soft">← Ngày trước</Link>
              <Link href={`/doi-lich-am-duong/ngay-${pad(nextDate.dd)}-thang-${pad(nextDate.mm)}-nam-${nextDate.yyyy}`} className="text-moon hover:text-gold-soft">Ngày sau →</Link>
              <a href="#lich-thang" className="text-moon hover:text-gold-soft">Xem cùng tháng</a>
              <Link href={`/${yyyy}-menh-gi`} className="text-moon hover:text-gold-soft">Xem mệnh năm {yyyy}</Link>
            </div>

            <div className="mystic-divider pt-8">
              <SeoContent />
            </div>

            <FaqSection faqs={FAQ_DOI_LICH} />
          </div>

          <SidebarTools year={yyyy} />
        </div>

        <p className="text-xs text-moon/50 mt-8 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
