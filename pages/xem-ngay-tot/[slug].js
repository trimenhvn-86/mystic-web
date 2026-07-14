import Head from 'next/head';
import { Sparkles, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ResultTabs from '../../components/ResultTabs';
import LucNhamPicker from '../../components/LucNhamPicker';
import CalendarImageCard from '../../components/CalendarImageCard';
import HubContentPreview from '../../components/HubContentPreview';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay } from '../../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities, getDecisionAssistant } from '../../lib/dayQuality';
import { getGioHoangDao } from '../../lib/gioHoangDao';
import { getNgayKhongMinh } from '../../lib/khongMinh';
import { getHubContentPreview } from '../../lib/sanity';
import HubDayLinks from '../../components/HubDayLinks';

const SLUG_RE = /^ngay-(\d{1,2})-thang-(\d{1,2})-nam-(\d{4})$/;

function parseSlug(slug) {
  const m = slug.match(SLUG_RE);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return { dd: Number(dd), mm: Number(mm), yyyy: Number(yyyy) };
}

export async function getStaticPaths() {
  const paths = [];
  const today = new Date();
  for (let i = -5; i <= 25; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    paths.push({ params: { slug: `ngay-${dd}-thang-${mm}-nam-${yyyy}` } });
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { notFound: true };
  const { dd, mm, yyyy } = parsed;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { notFound: true };

  const lunar = convertSolar2Lunar(dd, mm, yyyy);
  const canChiNam = getCanChiNam(lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const sao = getSao28(dd, mm, yyyy);
  const activities = getSuggestedActivities(truc);
  const gioHoangDao = getGioHoangDao(dd, mm, yyyy);
  const khongMinh = getNgayKhongMinh(lunar.day, lunar.month);
  const decisionAssistant = getDecisionAssistant(activities.isGoodDay, khongMinh?.tot, gioHoangDao[0]?.chi);
  const preview = await getHubContentPreview('lich-ngay-tot');

  return {
    props: { dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, gioHoangDao, khongMinh, decisionAssistant, ...preview },
    revalidate: 2592000 // ISR: cập nhật lại mỗi 24h
  };
}

export default function NgayTotXauResult({ dd, mm, yyyy, lunar, canChiNam, canChiNgay, truc, sao, activities, gioHoangDao, khongMinh, decisionAssistant, dictionaryPreview, guidePreview }) {
  const title = `Ngày ${dd}/${mm}/${yyyy} là ngày tốt hay xấu? — Tra cứu Lịch Vạn Niên`;
  const desc = `Xem ngày ${dd}/${mm}/${yyyy} (Âm lịch ${lunar.day}/${lunar.month}${lunar.leap ? ' nhuận' : ''}/${lunar.year}) có phải ngày Hoàng đạo không, Trực ${truc}, Sao ${sao}, ngày Khổng Minh, giờ Lục Nhâm, việc nên làm và nên tránh.`;

  const tabs = [
    {
      key: 'tong-quan',
      label: 'Tổng quan',
      content: (
        <div>
          <h2 className="sr-only">Ngày âm lịch hôm nay</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-center mb-4">
            <div>
              <p className="text-xs text-moon uppercase mb-1">Dương lịch</p>
              <p className="text-xl text-gold-soft font-display">{dd}/{mm}/{yyyy}</p>
            </div>
            <div>
              <p className="text-xs text-moon uppercase mb-1">Âm lịch</p>
              <p className="text-xl text-gold-soft font-display">
                {lunar.day}/{lunar.month}{lunar.leap ? ' (nhuận)' : ''}/{lunar.year}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-left mystic-divider pt-4">
            <p className="text-moon">Năm: <strong className="text-parchment">{canChiNam}</strong></p>
            <p className="text-moon">Ngày: <strong className="text-parchment">{canChiNgay}</strong></p>
            <p className="text-moon">Trực: <strong className="text-parchment">{truc}</strong></p>
            <p className="text-moon">Sao: <strong className="text-parchment">{sao}</strong></p>
          </div>
          <p className={`mt-4 pt-4 mystic-divider ${activities.isGoodDay ? 'text-jade font-semibold' : 'text-vermilion font-semibold'}`}>
            {activities.isGoodDay ? '✓ Đây là ngày Hoàng đạo — thuận lợi cho việc lớn.' : '✗ Đây là ngày cần cân nhắc — nên tránh việc trọng đại.'}
          </p>
        </div>
      )
    },
    {
      key: 'gio-dep',
      label: 'Giờ đẹp',
      content: (
        <div>
          <h2 className="sr-only">Giờ hoàng đạo trong ngày</h2>
          <p className="text-moon mb-3 text-sm">6 khung giờ Hoàng đạo tốt trong ngày:</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {gioHoangDao.map((g) => (
              <div key={g.chi} className="flex items-center justify-between bg-ink-soft rounded-lg px-4 py-2.5 border border-ink-line">
                <span className="text-gold-soft font-display">Giờ {g.chi}</span>
                <span className="text-moon text-sm">{g.khung}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'xuat-hanh',
      label: 'Xuất hành',
      content: (
        <div className="space-y-3">
          <h2 className="sr-only">Ngày xuất hành theo Khổng Minh</h2>
          <p className="text-moon text-sm">Theo Khổng Minh, hôm nay là ngày <strong className="text-gold-soft">{khongMinh?.ten}</strong>:</p>
          <p className={khongMinh?.tot ? 'text-jade' : 'text-vermilion'}>
            {khongMinh?.tot ? '✓ Nên xuất hành, cầu tài trong hôm nay.' : '✗ Không nên xuất hành xa hoặc cầu tài lớn trong hôm nay.'}
          </p>
          <p className="text-sm text-parchment/80">{khongMinh?.luanGiai}</p>
          <p className="text-xs text-moon/60 pt-2">Xem chi tiết đầy đủ ở tab &quot;Khổng Minh&quot; và tính giờ cụ thể ở tab &quot;Lục Nhâm&quot;.</p>
        </div>
      )
    },
    {
      key: 'khong-minh',
      label: 'Khổng Minh',
      content: (
        <div className="space-y-3">
          <h2 className="sr-only">Ngày xuất hành theo Khổng Minh</h2>
          <div className={`rounded-lg border p-4 ${khongMinh?.tot ? 'border-jade/40 bg-jade/5' : 'border-vermilion/40 bg-vermilion/5'}`}>
            <p className="flex items-center gap-2 mb-2">
              <span className="font-display text-xl text-gold-soft">Ngày {khongMinh?.ten}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${khongMinh?.tot ? 'text-jade border border-jade/40' : 'text-vermilion border border-vermilion/40'}`}>
                {khongMinh?.tot ? 'Tốt' : 'Xấu'}
              </span>
            </p>
            <p className="text-sm text-parchment/90">{khongMinh?.luanGiai}</p>
          </div>
          <p className="text-xs text-moon/50">
            * Theo tài liệu &quot;Ngày tốt xuất hành của Cụ Khổng Minh&quot; (ngày âm lịch, áp dụng mọi năm) — mang tính tham khảo, chiêm nghiệm dân gian.
          </p>
        </div>
      )
    },
    {
      key: 'luc-nham',
      label: 'Lục Nhâm',
      content: (
        <div>
          <h2 className="sr-only">Giờ xuất hành theo Lục Nhâm</h2>
          <LucNhamPicker lunarDay={lunar.day} lunarMonth={lunar.month} />
        </div>
      )
    },
    {
      key: 'nen-lam',
      label: 'Nên làm',
      content: (
        <div>
          <h2 className="sr-only">Việc nên làm hôm nay</h2>
          <ul className="list-disc pl-5 space-y-1">
            {activities.nenLam.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </div>
      )
    },
    {
      key: 'kieng-ky',
      label: 'Kiêng kỵ',
      content: (
        <div>
          <h2 className="sr-only">Việc nên tránh hôm nay</h2>
          <ul className="list-disc pl-5 space-y-1">
            {activities.kiengKy.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </div>
      )
    },
    {
      key: 'luan-giai',
      label: 'Luận giải chi tiết',
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-parchment/90">
          <h2 className="sr-only">Luận giải chi tiết ngày {dd}/{mm}/{yyyy}</h2>
          <p>
            Ngày {dd}/{mm}/{yyyy} Dương lịch tương ứng {lunar.day}/{lunar.month}{lunar.leap ? ' (nhuận)' : ''}/{lunar.year} Âm lịch,
            năm {canChiNam}, ngày {canChiNgay}. Ngày mang Trực <strong className="text-gold-soft">{truc}</strong> và
            Sao <strong className="text-gold-soft">{sao}</strong> trong Nhị Thập Bát Tú, được xếp vào nhóm{' '}
            {activities.isGoodDay ? <span className="text-jade">ngày Hoàng đạo</span> : <span className="text-vermilion">ngày cần cân nhắc</span>}.
          </p>
          <p>
            Theo cách tính của Khổng Minh, đây là ngày <strong className="text-gold-soft">{khongMinh?.ten}</strong>{' '}
            — {khongMinh?.tot ? 'thuận lợi cho việc xuất hành và cầu tài' : 'không thuận lợi cho việc xuất hành xa hoặc cầu tài lớn'}.
            {' '}{khongMinh?.luanGiai}
          </p>
          <p>
            Nếu cần chọn giờ xuất hành cụ thể trong ngày, nên tham khảo thêm tab Lục Nhâm (tính theo giờ dự định đi) và tab
            Giờ đẹp (giờ Hoàng đạo cố định trong ngày) để chọn thời điểm phù hợp nhất.
          </p>
          <p className="text-xs text-moon/50 pt-1">
            Toàn bộ nội dung trên mang tính tham khảo, chiêm nghiệm dân gian theo Lịch Vạn Niên — không thay thế quyết định cá nhân.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:image" content={`https://trimenh.com/api/lich-anh?dd=${dd}&mm=${mm}&yyyy=${yyyy}`} />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{title}</h1>
        <div className="grid md:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="order-1">
            <CalendarImageCard dd={dd} mm={mm} yyyy={yyyy} />
          </div>
          <div className="order-2 min-w-0">
            <ResultTabs tabs={tabs} />
          </div>
        </div>

        {/* Tro ly quyet dinh hom nay */}
        <div className="mystic-card p-6 mt-6">
          <p className="text-gold-soft font-semibold mb-1">Trợ lý quyết định hôm nay</p>
          <p className="text-xs text-moon mb-4">Nếu hôm nay bạn đang dự định:</p>
          <div className="space-y-2.5">
            {decisionAssistant.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 bg-ink-soft rounded-lg px-4 py-3 border border-ink-line">
                <span className="text-parchment text-sm">{item.label}</span>
                <span className={`flex items-center gap-1.5 text-sm font-medium ${item.good ? 'text-jade' : 'text-vermilion'}`}>
                  {item.good ? <ThumbsUp size={14} /> : item.decision.startsWith('Có thể') ? <HelpCircle size={14} /> : <ThumbsDown size={14} />}
                  {item.decision}
                </span>
              </div>
            ))}
          </div>
        </div>

        <HubDayLinks dd={dd} mm={mm} yyyy={yyyy} exclude="xem-ngay-tot" />

        <div className="mt-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>

        <p className="text-xs text-moon/50 mt-6 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
