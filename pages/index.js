import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsletterCTA from '../components/NewsletterCTA';
import PromoBanner from '../components/PromoBanner';
import FaqSection from '../components/FaqSection';
import {
  CalendarDays, Sparkles, Clock3, Hash, Dices, Users, Sun, Search as SearchIcon,
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
      dictionaryTerms: dictionaryTerms.slice(0, 6),
      guidePosts: guidePosts.slice(0, 6)
    },
    revalidate: 86400
  };
}

function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/tim-kiem${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  }
  return (
    <form onSubmit={handleSubmit} className="relative max-w-lg mb-6" role="search">
      <label htmlFor="hero-q" className="sr-only">Tìm công cụ, thuật ngữ, bài viết</label>
      <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-moon" aria-hidden="true" />
      <input
        id="hero-q"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm công cụ, thuật ngữ, bài viết"
        className="w-full bg-white border border-parchment rounded-md pl-11 pr-24 py-3.5 text-parchment text-base placeholder:text-moon/60"
      />
      <button type="submit" className="btn-gold absolute right-1.5 top-1.5 bottom-1.5 px-5 text-sm">Tìm</button>
    </form>
  );
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

export default function Home({ today, dailyCard, dailyCardUpright, napAmNgay, dictionaryTerms, guidePosts }) {
  const todaySlug = `ngay-${pad(today.dd)}-thang-${pad(today.mm)}-nam-${today.yyyy}`;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i).slice(0, 20);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

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
        {/* HERO: bên trái là lời mời tra cứu, bên phải là tờ lịch hôm nay */}
        <section className="border-b border-ink-line">
          <div className="max-w-6xl mx-auto px-5 py-12 sm:py-16 grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 md:gap-14 items-center">
            <div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] text-parchment leading-[1.1] mb-4">
                Xem ngày, tra mệnh, hiểu mình hơn mỗi ngày
              </h1>
              <p className="text-lg text-moon max-w-lg mb-7 leading-relaxed">
                Công cụ huyền học cho người Việt, miễn phí và có giải thích cách tính. Chọn một việc để bắt đầu.
              </p>
              <HeroSearch />
              <div className="flex flex-wrap gap-2.5">
                <Link href="/xem-ngay-tot" className="btn-line px-4 py-2 text-sm">Xem ngày tốt</Link>
                <Link href="/doi-lich-am-duong" className="btn-line px-4 py-2 text-sm">Đổi lịch âm dương</Link>
                <Link href="/menh-ngu-hanh" className="btn-line px-4 py-2 text-sm">Tra mệnh</Link>
                <Link href="/than-so-hoc" className="btn-line px-4 py-2 text-sm">Thần số học</Link>
              </div>
            </div>
            <TodayLeaf today={today} slug={todaySlug} />
          </div>
        </section>

        {/* Các mục xem nhanh trong ngày */}
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
            <Link href="/con-so-may-man" className="mystic-card p-4 hover:border-parchment transition-colors">
              <p className="text-sm text-moon mb-1">Con số may mắn</p>
              <p className="text-parchment font-display font-bold text-lg">Của bạn</p>
              <p className="text-xs text-moon">Nhập ngày sinh</p>
            </Link>
            <div className="mystic-card p-4">
              <p className="text-sm text-moon mb-1">Màu may mắn hôm nay</p>
              <p className="text-parchment font-display font-bold text-lg">{napAmNgay?.mauHop?.[0] || '—'}</p>
              <p className="text-xs text-moon">Hành {napAmNgay?.hanh}</p>
            </div>
          </div>
        </section>

        {/* Công cụ phổ biến */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Công cụ phổ biến</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {POPULAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href} className="mystic-card p-5 flex items-center gap-3 hover:border-parchment transition-colors">
                  <Icon size={22} className="text-lich flex-shrink-0" aria-hidden="true" />
                  <span className="text-parchment font-medium">{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Nhận email miễn phí */}
        <section id="nhan-email" className="bg-ink-soft border-y border-ink-line scroll-mt-24">
          <div className="max-w-6xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display font-extrabold text-3xl text-parchment mb-3">Nhận ngày tốt mỗi tháng, ngay trong hộp thư</h2>
              <p className="text-moon leading-relaxed">Dịch vụ email miễn phí của TriMenh. Chúng tôi chỉ gửi nội dung bạn đã đăng ký, và bạn hủy được bất cứ lúc nào.</p>
            </div>
            <NewsletterCTA title="Đăng ký bằng email" text="Điền email, bạn sẽ nhận lịch ngày tốt của tháng kế tiếp." source="trang-chu" />
          </div>
        </section>

        {/* 6 hub */}
        <section className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Sáu chuyên mục</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 border-t-2 border-parchment">
            {HUBS.map((h) => {
              const Icon = HUB_ICONS[h.icon] || Layers;
              return (
                <Link key={h.slug} href={`/${h.slug}`} className="py-5 border-b border-ink-line group flex gap-3">
                  <Icon size={22} className="text-lich flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-parchment group-hover:text-lich transition-colors">{h.name}</h3>
                    <p className="text-sm text-moon mt-0.5">{h.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tra cứu nhanh */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-5">Tra cứu nhanh</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-parchment mb-2">Theo năm sinh, xem mệnh</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <Link key={y} href={`/${y}-menh-gi`} className="px-3 py-1.5 rounded border border-ink-line bg-white text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{y}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-parchment mb-2">Theo số chủ đạo</p>
              <div className="flex flex-wrap gap-2">
                {numbers.map((n) => (
                  <Link key={n} href={`/than-so-hoc/so-chu-dao-${n}`} className="w-10 h-10 rounded border border-ink-line bg-white flex items-center justify-center text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{n}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-parchment mb-2">Theo con giáp, tử vi hôm nay</p>
              <div className="flex flex-wrap gap-2">
                {CHI.map((chi) => (
                  <Link key={chi} href={`/tu-vi-hom-nay/${CHI_SLUG[chi]}`} className="px-3 py-1.5 rounded border border-ink-line bg-white text-sm text-parchment hover:border-lich hover:text-lich transition-colors">{chi}</Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cẩm nang và từ điển */}
        <section className="max-w-6xl mx-auto px-5 pb-12 grid md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b-2 border-parchment">
              <h2 className="font-display font-bold text-2xl text-parchment">Cẩm nang</h2>
              <Link href="/cam-nang" className="text-sm text-lich font-medium hover:underline">Xem tất cả</Link>
            </div>
            <div className="divide-y divide-ink-line">
              {guidePosts.map((p) => (
                <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="block py-3.5 group">
                  <p className="font-display font-semibold text-parchment group-hover:text-lich transition-colors">{p.title}</p>
                  <p className="text-sm text-moon line-clamp-1">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b-2 border-parchment">
              <h2 className="font-display font-bold text-2xl text-parchment">Từ điển huyền học</h2>
              <Link href="/tu-dien" className="text-sm text-lich font-medium hover:underline">Xem tất cả</Link>
            </div>
            <div className="divide-y divide-ink-line">
              {dictionaryTerms.map((t) => (
                <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="block py-3.5 group">
                  <p className="font-display font-semibold text-parchment group-hover:text-lich transition-colors">{t.title}</p>
                  <p className="text-sm text-moon line-clamp-1">{t.shortDefinition}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Banner giới thiệu */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <PromoBanner placement="inline" seed="trang-chu-cuoi" />
        </section>

        {/* Về TriMenh */}
        <section className="max-w-2xl mx-auto px-5 pb-12">
          <h2 className="font-display font-bold text-2xl text-parchment mb-3">Về TriMenh</h2>
          <p className="text-parchment/85 leading-relaxed mb-3 font-read text-lg">
            TriMenh là nền tảng tra cứu và khám phá bản thân dành cho người Việt, kết hợp thần số học, tử vi, phong thủy,
            lịch âm dương, ngũ hành, tarot và cung hoàng đạo. Mỗi kết quả đều có phần giải thích cách tính để bạn tự kiểm tra.
          </p>
          <Link href="/gioi-thieu" className="text-sm text-lich font-medium hover:underline">Đọc thêm về TriMenh</Link>
        </section>

        <section className="max-w-2xl mx-auto px-5 pb-16">
          <FaqSection faqs={FAQ_HOMEPAGE} title="Câu hỏi thường gặp" />
        </section>
      </main>
      <Footer />
    </>
  );
}
