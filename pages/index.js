import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroLookup from '../components/HeroLookup';
import HubArt from '../components/art/HubArt';
import ZodiacStamp from '../components/art/ZodiacStamp';
import EmailStrip from '../components/EmailStrip';
import FaqSection from '../components/FaqSection';
import {
  CalendarDays, Sparkles, Clock3, Hash, Dices, Users, Sun,
  Layers, CircleDot, BookOpen, ArrowRight
} from 'lucide-react';
import { HUBS } from '../content/hubs';
import { FAQ_HOMEPAGE } from '../content/faq-data';
import { getDictionaryTerms, getGuidePosts } from '../lib/content';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay } from '../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities } from '../lib/dayQuality';
import { getDayRating } from '../lib/dayRating';
import { getGioHoangDao } from '../lib/gioHoangDao';
import { CHI_SLUG } from '../lib/chiSlug';
import { getVietnamNow } from '../lib/vnDate';
import { CHI } from '../lib/lunar';
import { getDailyCard } from '../lib/tarot';
import { getNapAmByCanChi } from '../lib/nguHanh';

const HUB_ICONS = { CalendarDays, Hash, Layers, Users, Sun, CircleDot };

const POPULAR_TOOLS = [
  { href: '/doi-lich-am-duong', title: 'Đổi Lịch Âm Dương', icon: CalendarDays },
  { href: '/xem-ngay-tot', title: 'Xem Ngày Tốt', icon: Sparkles },
  { href: '/than-so-hoc', title: 'Thần Số Học', icon: Hash },
  { href: '/menh-ngu-hanh', title: 'Tra Cứu Mệnh', icon: Layers },
  { href: '/tuoi-hop', title: 'Tuổi Hợp', icon: Users },
  { href: '/tu-vi-hom-nay', title: 'Tử Vi Hôm Nay', icon: Sun }
];

function pad(n) { return String(n).padStart(2, '0'); }

export async function getStaticProps() {
  const today = getVietnamNow();
  const dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  const lunar = convertSolar2Lunar(dd, mm, yyyy);
  const canChiNam = getCanChiNam(lunar.year);
  const canChiNgay = getCanChiNgay(dd, mm, yyyy);
  const truc = getTruc(dd, mm, yyyy, lunar.month);
  const activities = getSuggestedActivities(truc);
  const rating = getDayRating(truc);
  const gioHoangDao = getGioHoangDao(dd, mm, yyyy).slice(0, 3);
  const { card: dailyCard, upright: dailyCardUpright } = getDailyCard(dd, mm, yyyy);
  const napAmNgay = getNapAmByCanChi(canChiNgay);

  const [dictionaryTerms, guidePosts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);

  return {
    props: {
      today: { dd, mm, yyyy, lunar, canChiNam, canChiNgay, isGoodDay: activities.isGoodDay, rating, gioHoangDao },
      dailyCard, dailyCardUpright, napAmNgay,
      dictionaryTerms: dictionaryTerms.slice(0, 8).map((t) => ({ slug: t.slug, title: t.title })),
      todayIso: `${yyyy}-${pad(mm)}-${pad(dd)}`,
      guidePosts: guidePosts.slice(0, 4).map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt || '', hub: p.hub || '' }))
    },
    revalidate: 86400
  };
}

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

/* Tờ lịch hôm nay: nét nhận diện chính của trang chủ */
function TodayLeaf({ today, slug }) {
  const thu = THU[new Date(today.yyyy, today.mm - 1, today.dd).getDay()];
  const good = today.isGoodDay;
  return (
    <div className="lich-leaf shadow-[6px_6px_0_0_#1B1B24]">
      <div className="px-6 pt-5 pb-8">
        <p className="text-sm text-moon">{thu}, tháng {today.mm} năm {today.yyyy}</p>
        <p className="lich-num text-[7.5rem] sm:text-[9rem] -ml-1 mt-1">{today.dd}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
          <span className={`text-sm font-semibold px-2.5 py-1 rounded ${good ? 'bg-jade text-white' : 'bg-vermilion text-white'}`}>
            {good ? 'Hoàng đạo' : 'Hắc đạo'}
          </span>
          <span className="text-sm text-parchment">{today.rating.label}</span>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-ink-line pt-4">
          <div><dt className="text-moon">Âm lịch</dt><dd className="font-semibold text-parchment">{today.lunar.day}/{today.lunar.month}/{today.lunar.year}</dd></div>
          <div><dt className="text-moon">Ngày</dt><dd className="font-semibold text-parchment">{today.canChiNgay}</dd></div>
          <div className="col-span-2"><dt className="text-moon">Giờ đẹp</dt>
            <dd className="font-semibold text-parchment">{today.gioHoangDao.map((g) => `${g.chi} (${g.khung})`).join(', ')}</dd></div>
        </dl>
        <Link href={`/xem-ngay-tot/${slug}`} className="btn-gold mt-5 w-full py-3 text-center inline-flex items-center justify-center gap-2">
          Xem chi tiết hôm nay <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function Home({ today, todayIso, dailyCard, dailyCardUpright, napAmNgay, dictionaryTerms, guidePosts }) {
  const todaySlug = `ngay-${pad(today.dd)}-thang-${pad(today.mm)}-nam-${today.yyyy}`;
  const years = Array.from({ length: 12 }, (_, i) => today.yyyy - 18 - i * 3);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const hubArtKey = (slug) => (slug === 'than-so-hoc-hub' ? 'than-so-hoc' : slug);

  return (
    <>
      <Head>
        <title>TriMenh — Nền tảng tra cứu vận trình, phong thủy, thần số học</title>
        <meta
          name="description"
          content="Khám phá bản thân và tra cứu huyền học hiện đại: đổi lịch âm dương, xem ngày tốt, thần số học, mệnh ngũ hành, tuổi hợp, tử vi hôm nay — miễn phí, chính xác."
        />
      </Head>
      <Header />
      <main>
        {/* ĐẦU TRANG: tra cứu ngay + tờ lịch hôm nay */}
        <section className="border-b border-ink-line">
          <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14 grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-8 md:gap-12 items-start">
            <div>
              <h1 className="font-display font-extrabold text-[2rem] sm:text-5xl text-parchment leading-[1.12] mb-3">
                Xem ngày, tra mệnh,<br className="hidden sm:block" /> hiểu mình hơn<br className="hidden sm:block" /> mỗi ngày
              </h1>
              <p className="text-lg text-moon mb-6">Miễn phí, có giải thích cách tính.</p>
              <HeroLookup todayIso={todayIso} defaultYear={today.yyyy - 30} />
            </div>
            <TodayLeaf today={today} slug={todaySlug} />
          </div>
        </section>

        {/* Thông tin trong ngày */}
        <section className="max-w-6xl mx-auto px-5 py-10">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Hôm nay, {today.dd}/{today.mm}/{today.yyyy}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/tarot-hom-nay" className="mystic-card p-4 hover:border-parchment transition-colors">
              <p className="text-sm text-moon mb-1">Lá bài tarot hôm nay</p>
              <p className="text-parchment font-display font-bold text-lg">{dailyCard.nameVi}</p>
              <p className="text-xs text-moon">{dailyCardUpright ? 'Xuôi' : 'Ngược'}</p>
            </Link>
            <Link href="/tu-vi-hom-nay" className="mystic-card p-4 hover:border-parchment transition-colors">
              <p className="text-sm text-moon mb-1">Tử vi hôm nay</p>
              <p className="text-parchment font-display font-bold text-lg">12 con giáp</p>
              <p className="text-xs text-moon">Xem vận trình</p>
            </Link>
            <div className="mystic-card p-4">
              <p className="text-sm text-moon mb-1">Màu hợp hôm nay</p>
              <p className="text-parchment font-display font-bold text-lg">{napAmNgay?.mauHop?.[0] || '—'}</p>
              <p className="text-xs text-moon">Hành {napAmNgay?.hanh}</p>
            </div>
            <Link href="/con-so-may-man" className="mystic-card p-4 hover:border-lich border-lich/50 transition-colors flex flex-col justify-between">
              <p className="text-sm text-moon mb-1">Con số may mắn của bạn</p>
              <p className="text-lich font-display font-bold text-lg inline-flex items-center gap-1.5">Nhập ngày sinh để xem <ArrowRight size={16} aria-hidden="true" /></p>
            </Link>
          </div>
        </section>

        {/* Sáu chuyên mục, có tranh */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Sáu chuyên mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {HUBS.map((h) => (
              <Link key={h.slug} href={`/${h.slug}`} className="mystic-card overflow-hidden group hover:border-parchment transition-colors">
                <div className="aspect-[16/7] overflow-hidden border-b border-ink-line" aria-hidden="true"><HubArt hub={hubArtKey(h.slug)} variant="cover" /></div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-lg text-parchment group-hover:text-lich transition-colors">{h.name}</h3>
                  <p className="hidden sm:block text-sm text-moon mt-1 line-clamp-2">{h.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cẩm nang nổi bật */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display font-bold text-2xl text-parchment">Cẩm nang nổi bật</h2>
            <Link href="/cam-nang" className="text-sm text-lich font-medium hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {guidePosts.map((p) => (
              <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="mystic-card overflow-hidden group hover:border-parchment transition-colors">
                <div className="aspect-[16/9] overflow-hidden border-b border-ink-line" aria-hidden="true"><HubArt hub={p.hub || 'lich-ngay-tot'} variant="cover" /></div>
                <p className="p-3 sm:p-4 text-sm sm:text-base font-display font-semibold text-parchment leading-snug group-hover:text-lich transition-colors">{p.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tra cứu nhanh */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Tra cứu nhanh</h2>
          <div className="space-y-7">
            <div>
              <p className="text-sm font-semibold text-parchment mb-2">Xem mệnh theo năm sinh</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <Link key={y} href={`/${y}-menh-gi`} className="min-w-[4.25rem] min-h-[2.75rem] flex items-center justify-center px-3 rounded border border-ink-line bg-white text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{y}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-parchment mb-2">Số chủ đạo</p>
              <div className="flex flex-wrap gap-2">
                {numbers.map((n) => (
                  <Link key={n} href={`/than-so-hoc/so-chu-dao-${n}`} className="w-11 h-11 rounded border border-ink-line bg-white flex items-center justify-center text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{n}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-parchment mb-3">Tử vi hôm nay theo con giáp</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-y-4 gap-x-2">
                {CHI.map((chi) => <ZodiacStamp key={chi} chi={chi} href={`/tu-vi-hom-nay/${CHI_SLUG[chi]}`} />)}
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-sm font-semibold text-parchment">Từ điển huyền học</p>
                <Link href="/tu-dien" className="text-sm text-lich font-medium hover:underline">Xem tất cả</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {dictionaryTerms.map((t) => (
                  <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="px-3 py-2 rounded border border-ink-line bg-white text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{t.title}</Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vì sao dùng TriMenh: bốn ô ngắn */}
        <section className="bg-ink-soft border-y border-ink-line">
          <div className="max-w-6xl mx-auto px-5 py-12">
            <h2 className="font-display font-bold text-2xl text-parchment mb-6">Vì sao dùng TriMenh</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                [Sparkles, 'Miễn phí', 'Tra cứu không cần đăng ký.'],
                [BookOpen, 'Có giải thích cách tính', 'Bạn tự kiểm tra được kết quả.'],
                [CalendarDays, 'Cập nhật theo ngày', 'Lịch, tử vi và tarot đổi mỗi ngày.'],
                [Users, 'Do ban biên soạn viết', 'Có tên người biên soạn và nguồn.']
              ].map(([Icon, t, d]) => (
                <div key={t} className="mystic-card p-5">
                  <Icon size={22} className="text-lich mb-3" aria-hidden="true" />
                  <p className="font-display font-bold text-parchment">{t}</p>
                  <p className="text-sm text-moon mt-1">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm">
              <Link href="/gioi-thieu" className="text-lich font-medium hover:underline mr-5">Giới thiệu</Link>
              <Link href="/ban-bien-soan" className="text-lich font-medium hover:underline mr-5">Ban biên soạn</Link>
              <Link href="/phuong-phap-tinh" className="text-lich font-medium hover:underline">Phương pháp tính</Link>
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-5 py-12">
          <FaqSection faqs={FAQ_HOMEPAGE} title="Câu hỏi thường gặp" />
        </section>

      </main>
      {/* Email: dải gọn, ngay trên footer */}
      <section id="nhan-email" className="bg-ink-soft border-t border-ink-line scroll-mt-24 mt-12">
        <div className="max-w-6xl mx-auto px-5 py-6 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4 md:gap-8 items-center">
          <div>
            <h2 className="font-display font-bold text-xl text-parchment">Nhận lịch ngày tốt tháng tới</h2>
            <p className="text-sm text-moon mt-1">Mỗi tháng một email miễn phí, hủy bất cứ lúc nào.</p>
          </div>
          <EmailStrip />
        </div>
      </section>
      <Footer noTopMargin />
    </>
  );
}
