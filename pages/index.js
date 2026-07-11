import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroRing from '../components/HeroRing';
import FaqSection from '../components/FaqSection';
import {
  CalendarDays, Sparkles, Clock3, Hash, Dices, Users, Sun, Search as SearchIcon,
  Layers, CircleDot, BookOpen, ArrowRight
} from 'lucide-react';
import { HUBS } from '../content/hubs';
import { FAQ_HOMEPAGE } from '../content/faq-data';
import { getDictionaryTerms, getGuidePosts } from '../lib/sanity';
import { convertSolar2Lunar, getCanChiNam, getCanChiNgay } from '../lib/lunar';
import { getTruc, getSao28, getSuggestedActivities } from '../lib/dayQuality';
import { getDayRating } from '../lib/dayRating';
import { getGioHoangDao } from '../lib/gioHoangDao';
import { CHI_SLUG } from '../lib/chiSlug';
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
  const today = new Date();
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
    revalidate: 3600
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
    <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto mb-6">
      <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-moon" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm công cụ, thuật ngữ, bài viết..."
        className="w-full bg-ink-soft border border-ink-line rounded-full pl-11 pr-24 py-3.5 text-parchment text-base"
      />
      <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-gold text-ink text-sm font-semibold">
        Tìm
      </button>
    </form>
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
        {/* SECTION 2 - HERO */}
        <section className="relative overflow-hidden border-b border-ink-line">
          <HeroRing />
          <div className="relative max-w-3xl mx-auto px-5 pt-16 pb-14 text-center">
            <p className="text-gold text-xs uppercase tracking-[0.2em] mb-4">Khám phá vận mệnh, kiến tạo tương lai.</p>
            <h1 className="font-display text-4xl sm:text-5xl text-parchment mb-4 leading-tight">
              Khám phá bản thân &amp; tra cứu huyền học hiện đại
            </h1>
            <HeroSearch />
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link href="/doi-lich-am-duong" className="px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Đổi lịch</Link>
              <Link href="/xem-ngay-tot" className="px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Ngày tốt</Link>
              <Link href="/menh-ngu-hanh" className="px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh</Link>
              <Link href="/than-so-hoc" className="px-4 py-2 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Thần số</Link>
            </div>
          </div>
        </section>

        {/* SECTION 3 - 6 HUB */}
        <section className="max-w-6xl mx-auto px-5 py-14">
          <h2 className="font-display text-2xl text-parchment mb-6">6 Hub tri thức</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {HUBS.map((h) => {
              const Icon = HUB_ICONS[h.icon] || Layers;
              return (
                <Link key={h.slug} href={`/${h.slug}`} className="mystic-card p-5 hover:-translate-y-1 hover:border-gold/40 transition-transform">
                  <div className="w-10 h-10 rounded-lg bg-ink-soft border border-ink-line flex items-center justify-center mb-3">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-gold-soft mb-1">{h.name}</h3>
                  <p className="text-sm text-moon/75">{h.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 4 - CONG CU PHO BIEN */}
        <section className="max-w-6xl mx-auto px-5 pb-14">
          <h2 className="font-display text-2xl text-parchment mb-6">Công cụ phổ biến</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {POPULAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href} className="mystic-card p-5 flex items-center gap-3 hover:-translate-y-1 hover:border-gold/40 transition-transform">
                  <Icon size={22} className="text-gold flex-shrink-0" />
                  <span className="text-parchment">{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 6 - HOM NAY */}
        <section className="max-w-4xl mx-auto px-5 pb-14">
          <h2 className="font-display text-2xl text-parchment mb-6">🔥 Hôm nay {today.dd}/{today.mm}/{today.yyyy}</h2>
          <div className="mystic-card p-6 grid sm:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-xs text-moon uppercase mb-1">Âm lịch</p>
              <p className="text-xl text-gold-soft font-display mb-3">{today.lunar.day}/{today.lunar.month}/{today.lunar.year}</p>
              <p className="text-sm text-moon">Năm {today.canChiNam} — Ngày {today.canChiNgay}</p>
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={i <= today.rating.stars ? 'text-gold' : 'text-ink-line'}>★</span>
                ))}
                <span className="text-sm text-moon ml-2">{today.rating.label}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-moon uppercase mb-2">Giờ đẹp hôm nay</p>
              <div className="flex flex-col gap-1.5">
                {today.gioHoangDao.map((g) => (
                  <span key={g.chi} className="text-sm text-parchment/85">Giờ {g.chi} ({g.khung})</span>
                ))}
              </div>
              <Link href={`/xem-ngay-tot/${todaySlug}`} className="inline-flex items-center gap-1 text-sm text-gold-soft hover:underline mt-4">
                Xem chi tiết hôm nay <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/tarot-hom-nay" className="mystic-card p-4 hover:border-gold/40 transition-colors">
              <p className="text-xs text-moon uppercase mb-1">Tarot hôm nay</p>
              <p className="text-gold-soft font-display text-lg">{dailyCard.nameVi}</p>
              <p className="text-xs text-moon/70">{dailyCardUpright ? 'Xuôi' : 'Ngược'}</p>
            </Link>
            <Link href="/tu-vi-hom-nay" className="mystic-card p-4 hover:border-gold/40 transition-colors">
              <p className="text-xs text-moon uppercase mb-1">Tử vi hôm nay</p>
              <p className="text-gold-soft font-display text-lg">12 con giáp</p>
              <p className="text-xs text-moon/70">Xem vận trình →</p>
            </Link>
            <Link href="/con-so-may-man" className="mystic-card p-4 hover:border-gold/40 transition-colors">
              <p className="text-xs text-moon uppercase mb-1">Con số may mắn</p>
              <p className="text-gold-soft font-display text-lg">Của bạn</p>
              <p className="text-xs text-moon/70">Nhập ngày sinh →</p>
            </Link>
            <div className="mystic-card p-4">
              <p className="text-xs text-moon uppercase mb-1">Màu may mắn hôm nay</p>
              <p className="text-gold-soft font-display text-lg">{napAmNgay?.mauHop?.[0] || '—'}</p>
              <p className="text-xs text-moon/70">{napAmNgay?.hanh}</p>
            </div>
          </div>
        </section>

        {/* SECTION 5 - TRA CUU NHANH */}
        <section className="max-w-6xl mx-auto px-5 pb-14">
          <h2 className="font-display text-2xl text-parchment mb-6">Tra cứu nhanh</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-moon mb-2">Theo năm sinh — xem mệnh</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <Link key={y} href={`/${y}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">{y}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-moon mb-2">Theo con số chủ đạo</p>
              <div className="flex flex-wrap gap-2">
                {numbers.map((n) => (
                  <Link key={n} href={`/than-so-hoc/so-chu-dao-${n}`} className="w-10 h-10 rounded-full bg-ink-soft border border-ink-line flex items-center justify-center text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">{n}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-moon mb-2">Theo 12 con giáp — tử vi hôm nay</p>
              <div className="flex flex-wrap gap-2">
                {CHI.map((chi) => (
                  <Link key={chi} href={`/tu-vi-hom-nay/${CHI_SLUG[chi]}`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">{chi}</Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 - TU DIEN HUYEN HOC */}
        <section className="max-w-6xl mx-auto px-5 pb-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl text-parchment">Từ điển huyền học</h2>
            <Link href="/tu-dien" className="text-sm text-gold-soft hover:underline">Xem tất cả →</Link>
          </div>
          {dictionaryTerms.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dictionaryTerms.map((t) => (
                <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="mystic-card p-4 hover:border-gold/40 transition-colors">
                  <p className="text-gold-soft font-medium">{t.title}</p>
                  <p className="text-sm text-moon/70 line-clamp-1">{t.shortDefinition}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-moon/50">Từ điển đang được xây dựng — nội dung sẽ cập nhật qua CMS.</p>
          )}
        </section>

        {/* SECTION 9 - CAM NANG */}
        <section className="max-w-6xl mx-auto px-5 pb-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl text-parchment">Cẩm nang</h2>
            <Link href="/cam-nang" className="text-sm text-gold-soft hover:underline">Xem tất cả →</Link>
          </div>
          {guidePosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {guidePosts.map((p) => (
                <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="mystic-card p-5 hover:border-gold/40 transition-colors">
                  <p className="text-gold-soft font-display text-lg mb-1">{p.title}</p>
                  <p className="text-sm text-moon/70 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-moon/50">Cẩm nang đang được xây dựng — bài viết đầu tiên sẽ sớm ra mắt.</p>
          )}
        </section>

        {/* SECTION 11 - GIOI THIEU */}
        <section className="max-w-2xl mx-auto px-5 pb-14 text-center">
          <h2 className="font-display text-2xl text-parchment mb-4">Về TriMenh</h2>
          <p className="text-parchment/80 leading-relaxed mb-3">
            TriMenh là nền tảng tra cứu và khám phá bản thân dành cho người Việt, kết hợp thần số học, tử vi, phong thủy,
            lịch âm dương, ngũ hành, tarot, cung hoàng đạo cùng nhiều công cụ hiện đại để mang đến góc nhìn đa chiều về
            mỗi cá nhân — giúp bạn hiểu mình rõ hơn và sống chủ động hơn.
          </p>
          <Link href="/gioi-thieu" className="text-sm text-gold-soft hover:underline">Đọc thêm về TriMenh →</Link>
        </section>

        {/* SECTION 12 - FAQ */}
        <section className="max-w-2xl mx-auto px-5 pb-16">
          <FaqSection faqs={FAQ_HOMEPAGE} title="Câu hỏi thường gặp" />
        </section>
      </main>
      <Footer />
    </>
  );
}
