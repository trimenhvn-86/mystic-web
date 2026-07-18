import Head from 'next/head';
import Link from 'next/link';
import { Layers, Users, CalendarDays, Hash, Sun, CircleDot, BookOpen, ArrowRight, Star, Palette, Gem } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdSlot from '../components/AdSlot';
import FaqSection from '../components/FaqSection';
import HubContentPreview from '../components/HubContentPreview';
import { getMenhNguHanh, getNguHanhExtra, getAmDuongCan } from '../lib/nguHanh';
import { getChiFromYear, getTuoiHop, getYearsForChi } from '../lib/tuoiHop';
import { getLuckyNumbers, HA_DO } from '../lib/luckyNumber';
import { HUBS, getHubBySlug, getCmsHubValue } from '../content/hubs';
import { getDictionaryTerms, getGuidePosts, getHubContentPreview } from '../lib/sanity';
import { FAQ_MENH, FAQ_TUOI_HOP } from '../content/faq-data';
import napAmData from '../content/phong-thuy/menh/nap-am.json';
import daPhongThuyData from '../content/phong-thuy/da-phong-thuy.json';
import MiniCalendar from '../components/MiniCalendar';
import NumerologyQuickForm from '../components/NumerologyQuickForm';
import TuViQuickLinks from '../components/TuViQuickLinks';
import TarotToolGroups, { TarotHeroCTA } from '../components/TarotHubExtras';
import TuoiHopLinks from '../components/TuoiHopLinks';
import MenhPhongThuyLinks from '../components/MenhPhongThuyLinks';

const HUB_ICONS = { CalendarDays, Hash, Layers, Users, Sun, CircleDot };
const MENH_RE = /^(\d{4})-menh-gi$/;
const HOP_TUOI_RE = /^(\d{4})-hop-tuoi-nao$/;
const HOP_MAU_RE = /^(\d{4})-hop-mau-gi$/;
const HOP_DA_RE = /^(\d{4})-hop-da-gi$/;

export async function getStaticPaths() {
  const paths = HUBS.map((h) => ({ params: { slug: h.slug } }));
  const currentYear = new Date().getFullYear();
  // Sinh sẵn 80 năm sinh phổ biến nhất (currentYear-70 .. currentYear-2) cho cả 4 loại trang
  for (let y = currentYear - 70; y <= currentYear - 2; y++) {
    paths.push({ params: { slug: `${y}-menh-gi` } });
    paths.push({ params: { slug: `${y}-hop-tuoi-nao` } });
    paths.push({ params: { slug: `${y}-hop-mau-gi` } });
    paths.push({ params: { slug: `${y}-hop-da-gi` } });
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const hub = getHubBySlug(slug);
  if (hub) {
    const cmsHubValue = getCmsHubValue(hub);
    const [allTerms, allGuides] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);
    const dictionaryPreview = allTerms.filter((t) => t.hub === cmsHubValue).slice(0, 8);
    const guidePreview = allGuides.filter((g) => g.hub === cmsHubValue).slice(0, 6);
    return { props: { type: 'hub', hub, dictionaryPreview, guidePreview }, revalidate: 86400 };
  }

  const menhMatch = slug.match(MENH_RE);
  const hopTuoiMatch = slug.match(HOP_TUOI_RE);

  if (menhMatch) {
    const year = Number(menhMatch[1]);
    if (year < 1900 || year > 2100) return { notFound: true };
    const menh = getMenhNguHanh(year);
    if (!menh) return { notFound: true };
    const amDuong = getAmDuongCan(menh.canChi);
    const extra = getNguHanhExtra(menh.hanh);
    const luckyNumbers = getLuckyNumbers(1, 1, year);
    const chi = getChiFromYear(year);
    const tuoiHopForMenh = getTuoiHop(chi);
    const mauKy = extra.khacBoi ? napAmData.mauHopMenh[extra.khacBoi] : [];
    const preview = await getHubContentPreview('menh-phong-thuy');
    return {
      props: { type: 'menh', year, menh, amDuong, extra, luckyNumbers, tuoiHopForMenh, mauKy, ...preview },
      revalidate: 2592000
    };
  }

  if (hopTuoiMatch) {
    const year = Number(hopTuoiMatch[1]);
    if (year < 1900 || year > 2100) return { notFound: true };
    const chi = getChiFromYear(year);
    const tuoiHop = getTuoiHop(chi);
    const preview = await getHubContentPreview('tuoi-tuong-hop');
    return { props: { type: 'hop-tuoi', year, tuoiHop, ...preview }, revalidate: 2592000 };
  }

  const hopMauMatch = slug.match(HOP_MAU_RE);
  if (hopMauMatch) {
    const year = Number(hopMauMatch[1]);
    if (year < 1900 || year > 2100) return { notFound: true };
    const menh = getMenhNguHanh(year);
    if (!menh) return { notFound: true };
    const extra = getNguHanhExtra(menh.hanh);
    const mauKy = extra.khacBoi ? napAmData.mauHopMenh[extra.khacBoi] : [];
    const preview = await getHubContentPreview('menh-phong-thuy');
    return { props: { type: 'mau', year, menh, mauKy, ...preview }, revalidate: 2592000 };
  }

  const hopDaMatch = slug.match(HOP_DA_RE);
  if (hopDaMatch) {
    const year = Number(hopDaMatch[1]);
    if (year < 1900 || year > 2100) return { notFound: true };
    const menh = getMenhNguHanh(year);
    if (!menh) return { notFound: true };
    const daInfo = daPhongThuyData[menh.hanh];
    const preview = await getHubContentPreview('menh-phong-thuy');
    return { props: { type: 'da', year, menh, daInfo, ...preview }, revalidate: 2592000 };
  }

  return { notFound: true };
}

export default function YearToolPage({ type, year, menh, tuoiHop, hub, dictionaryPreview, guidePreview, amDuong, extra, luckyNumbers, tuoiHopForMenh, mauKy, daInfo }) {
  if (type === 'hub') {
    const Icon = HUB_ICONS[hub.icon] || Layers;
    return (
      <>
        <Head>
          <title>{hub.name} — TriMenh</title>
          <meta name="description" content={hub.desc} />
        </Head>
        <Header />
        <main className="max-w-4xl mx-auto px-5 py-8 sm:py-12">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-moon mb-6">
            <Link href="/" className="hover:text-gold-soft transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-parchment/70">{hub.name}</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Icon size={30} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">{hub.name}</h1>
          <p className="text-moon/80 text-center max-w-lg mx-auto mb-10">{hub.desc}</p>

          {hub.slug === 'tarot' && <TarotHeroCTA />}

          {hub.slug !== 'than-so-hoc-hub' && hub.slug !== 'tarot' && (
            <section className="mb-10">
              <h2 className="font-display text-xl text-parchment mb-4">Công cụ trong {hub.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {hub.tools.map((tool) =>
                  tool.active ? (
                    <Link key={tool.label} href={tool.href} className="mystic-card px-4 py-3.5 flex items-center justify-between hover:border-gold/40 transition-colors">
                      <span className="text-parchment">{tool.label}</span>
                      <ArrowRight size={16} className="text-gold" />
                    </Link>
                  ) : (
                    <div key={tool.label} className="mystic-card px-4 py-3.5 flex items-center justify-between opacity-50">
                      <span className="text-parchment/70">{tool.label}</span>
                      <span className="text-[10px] uppercase text-moon/60">Sắp ra mắt</span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {hub.slug === 'tarot' && (
            <section className="mb-10">
              <h2 className="font-display text-xl text-parchment mb-4">Công cụ trong {hub.name}</h2>
              <TarotToolGroups />
            </section>
          )}

          {hub.slug === 'lich-ngay-tot' && (
            <section className="mb-10">
              <h2 className="font-display text-xl text-parchment mb-4">Lịch tháng — Hoàng đạo &amp; Hắc đạo</h2>
              <MiniCalendar
                dd={new Date().getDate()}
                mm={new Date().getMonth() + 1}
                yyyy={new Date().getFullYear()}
                basePath="/xem-ngay-tot"
                showQuality
              />
            </section>
          )}

          {hub.slug === 'than-so-hoc-hub' && (
            <section className="mb-10">
              <h2 className="font-display text-xl text-parchment mb-4">Công cụ trong {hub.name}</h2>
              <NumerologyQuickForm />
            </section>
          )}

          {hub.slug === 'tu-vi' && (
            <section className="mb-10">
              <h2 className="font-display text-xl text-parchment mb-4">Tra cứu nhanh</h2>
              <TuViQuickLinks />
            </section>
          )}

          <AdSlot label={`Ad slot — hub ${hub.name}`} className="mb-10" />

          <section className="mb-10">
            <h2 className="font-display text-xl text-parchment mb-4">Từ điển liên quan</h2>
            {dictionaryPreview.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {dictionaryPreview.map((t) => (
                  <Link key={t.slug} href={`/tu-dien/${t.slug}`} className="mystic-card px-4 py-3 hover:border-gold/40 transition-colors">
                    <p className="text-gold-soft font-medium">{t.title}</p>
                    <p className="text-sm text-moon/70 line-clamp-1">{t.shortDefinition}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-moon/50">Chưa có thuật ngữ nào cho mục này — nội dung sẽ được cập nhật qua CMS.</p>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl text-parchment mb-4">Cẩm nang liên quan</h2>
            {guidePreview.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {guidePreview.map((g) => (
                  <Link key={g.slug} href={`/cam-nang/${g.slug}`} className="mystic-card px-4 py-3 hover:border-gold/40 transition-colors">
                    <p className="text-gold-soft font-medium">{g.title}</p>
                    <p className="text-sm text-moon/70 line-clamp-2">{g.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-moon/50">Chưa có bài cẩm nang nào cho mục này — nội dung sẽ được cập nhật qua CMS.</p>
            )}
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (type === 'menh') {
    const title = `Sinh năm ${year} mệnh gì? — Tra cứu Ngũ Hành`;
    const desc = `Người sinh năm ${year} (${menh.canChi}) thuộc mệnh ${menh.hanh} — nạp âm ${menh.napAm}. Xem màu hợp mệnh, con số may mắn, hướng hợp và nghề nghiệp phù hợp.`;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={desc} />
        </Head>
        <Header />
        <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12">
          <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Layers size={26} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

          <div className="space-y-6">
            {/* Ket qua nhanh + Dashboard */}
            <div className="mystic-card p-6 text-center">
              <p className="text-xs text-moon uppercase mb-1">Sinh năm</p>
              <p className="font-display text-3xl text-gold-soft mb-2">{year}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} className="fill-gold text-gold" />)}
              </div>
              <div className="grid sm:grid-cols-4 gap-3 text-sm mt-4">
                <div className="bg-ink-soft rounded-lg border border-ink-line px-2 py-3">
                  <p className="text-parchment font-medium">{menh.canChi}</p>
                  <p className="text-[11px] text-moon mt-1">Can Chi</p>
                </div>
                <div className="bg-ink-soft rounded-lg border border-ink-line px-2 py-3">
                  <p className="text-parchment font-medium">{amDuong} {menh.hanh}</p>
                  <p className="text-[11px] text-moon mt-1">Âm / Dương</p>
                </div>
                <div className="bg-ink-soft rounded-lg border border-ink-line px-2 py-3">
                  <p className="text-parchment font-medium">{menh.napAm}</p>
                  <p className="text-[11px] text-moon mt-1">Nạp Âm</p>
                </div>
                <div className="bg-ink-soft rounded-lg border border-ink-line px-2 py-3">
                  <p className="text-parchment font-medium">{menh.hanh}</p>
                  <p className="text-[11px] text-moon mt-1">Hành</p>
                </div>
              </div>
            </div>

            {/* Y nghia ban menh */}
            <div className="mystic-card p-6">
              <h2 className="font-display text-lg text-parchment mb-2">Đặc điểm mệnh {menh.hanh}</h2>
              <p className="text-parchment/85">{menh.moTa}</p>
            </div>

            {/* Quan he ngu hanh */}
            <div className="mystic-card p-6">
              <h2 className="font-display text-lg text-parchment mb-3">Quan hệ Ngũ Hành</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-jade/10 border border-jade/30 rounded-lg px-3 py-2.5">
                  <p className="text-jade font-medium">Được sinh bởi: {extra.duocSinhBoi}</p>
                </div>
                <div className="bg-jade/10 border border-jade/30 rounded-lg px-3 py-2.5">
                  <p className="text-jade font-medium">Sinh ra: {extra.sinhRa}</p>
                </div>
                <div className="bg-vermilion/10 border border-vermilion/30 rounded-lg px-3 py-2.5">
                  <p className="text-vermilion font-medium">Khắc: {extra.khac}</p>
                </div>
                <div className="bg-vermilion/10 border border-vermilion/30 rounded-lg px-3 py-2.5">
                  <p className="text-vermilion font-medium">Bị khắc bởi: {extra.khacBoi}</p>
                </div>
              </div>
            </div>

            {/* Mau sac */}
            <div className="mystic-card p-6 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-jade font-semibold mb-2">Màu hợp mệnh {menh.hanh}</p>
                <div className="flex gap-2 flex-wrap">
                  {menh.mauHop.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-jade/30 text-sm">{c}</span>
                  ))}
                </div>
              </div>
              {mauKy?.length > 0 && (
                <div>
                  <p className="text-vermilion font-semibold mb-2">Màu nên hạn chế</p>
                  <div className="flex gap-2 flex-wrap">
                    {mauKy.map((c) => (
                      <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-vermilion/30 text-sm">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <AdSlot label="Ad slot — mệnh ngũ hành" />

            {/* Con so may man + Huong hop */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="mystic-card p-5">
                <p className="text-xs text-moon uppercase mb-3">Con số may mắn</p>
                <div className="flex gap-2 flex-wrap">
                  {luckyNumbers.hanhNumbers.map((n) => (
                    <span key={n} className="w-9 h-9 rounded-full bg-gold text-ink font-display flex items-center justify-center">{n}</span>
                  ))}
                </div>
                <Link href="/con-so-may-man" className="text-xs text-gold-soft hover:underline mt-3 inline-block">Xem chi tiết →</Link>
              </div>
              <div className="mystic-card p-5">
                <p className="text-xs text-moon uppercase mb-3">Hướng hợp</p>
                <div className="flex gap-2 flex-wrap">
                  {extra.huong.map((h) => (
                    <span key={h} className="px-3 py-1 rounded-full bg-ink-soft border border-ink-line text-sm">{h}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tuoi hop */}
            <div className="mystic-card p-6">
              <p className="text-xs text-moon uppercase mb-3">Tuổi hợp (Tam hợp)</p>
              <div className="flex gap-2 flex-wrap mb-2">
                {tuoiHopForMenh.hopTuoi.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-jade/30 text-sm">
                    Tuổi {c} ({getYearsForChi(c, year).join(', ')})
                  </span>
                ))}
              </div>
              <Link href={`/${year}-hop-tuoi-nao`} className="text-xs text-gold-soft hover:underline">Xem đầy đủ tuổi hợp/xung →</Link>
            </div>

            {/* Nghe nghiep + vat pham */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="mystic-card p-5">
                <p className="text-xs text-moon uppercase mb-3">Nghề nghiệp phù hợp</p>
                <ul className="text-sm text-parchment/85 space-y-1">
                  {extra.ngheNghiep.map((n) => <li key={n}>• {n}</li>)}
                </ul>
              </div>
              <div className="mystic-card p-5">
                <p className="text-xs text-moon uppercase mb-3">Vật phẩm phong thủy gợi ý</p>
                <ul className="text-sm text-parchment/85 space-y-1">
                  {extra.vatPham.map((v) => <li key={v}>• {v}</li>)}
                </ul>
              </div>
            </div>

            {/* Tra cuu nhanh theo nam */}
            <div>
              <p className="text-sm text-moon mb-3">Tra cứu nhanh theo năm sinh:</p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <Link key={y} href={`/${y}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">{y}</Link>
                ))}
              </div>
            </div>

            {/* Tool lien quan */}
            <div>
              <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/${year}-hop-tuoi-nao`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tuổi hợp</Link>
                <Link href="/xem-ngay-tot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Xem ngày tốt</Link>
                <Link href="/than-so-hoc" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Thần số học</Link>
                <Link href="/con-so-may-man" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Con số may mắn</Link>
              </div>
            </div>

            <MenhPhongThuyLinks year={year} exclude="menh" />

            <FaqSection faqs={FAQ_MENH} />

            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>

          <p className="text-xs text-moon/50 mt-8 text-center">
            Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (type === 'mau') {
    const COLOR_DOT = {
      'Trắng': 'bg-gray-100', 'Xám': 'bg-gray-400', 'Ánh kim': 'bg-yellow-100',
      'Xanh lá': 'bg-jade', 'Xanh rêu': 'bg-jade',
      'Đen': 'bg-black', 'Xanh dương đậm': 'bg-blue-900',
      'Đỏ': 'bg-vermilion', 'Cam': 'bg-orange-500', 'Hồng': 'bg-pink-400',
      'Vàng đất': 'bg-yellow-700', 'Nâu': 'bg-yellow-900'
    };
    const title = `Sinh năm ${year} hợp màu gì? — Mệnh ${menh.hanh}`;
    const desc = `Người sinh năm ${year} (${menh.canChi}) mệnh ${menh.hanh} hợp với các màu: ${menh.mauHop.join(', ')}. Nên tránh: ${mauKy.join(', ') || 'không có màu kỵ rõ rệt'}.`;
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={desc} />
        </Head>
        <Header />
        <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
          <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Palette size={26} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{title}</h1>

          <div className="mystic-card p-6 space-y-5">
            <p className="text-center text-moon">
              Năm sinh <strong className="text-gold-soft">{menh.canChi}</strong> — Mệnh{' '}
              <strong className="text-gold-soft text-xl">{menh.hanh}</strong> ({menh.napAm})
            </p>

            <div>
              <p className="text-jade font-semibold mb-3">Màu hợp mệnh — nên dùng</p>
              <div className="flex flex-wrap gap-2">
                {menh.mauHop.map((m) => {
                  const baseColor = m.split(' (')[0];
                  return (
                    <span key={m} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-soft border border-jade/30 text-sm">
                      <span className={`w-3 h-3 rounded-full ${COLOR_DOT[baseColor] || 'bg-gold'}`} />
                      {m}
                    </span>
                  );
                })}
              </div>
            </div>

            {mauKy.length > 0 && (
              <div className="mystic-divider pt-4">
                <p className="text-vermilion font-semibold mb-3">Màu nên tránh (khắc mệnh)</p>
                <div className="flex flex-wrap gap-2">
                  {mauKy.map((m) => {
                    const baseColor = m.split(' (')[0];
                    return (
                      <span key={m} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-soft border border-vermilion/30 text-sm">
                        <span className={`w-3 h-3 rounded-full ${COLOR_DOT[baseColor] || 'bg-vermilion'}`} />
                        {m}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-xs text-moon/60 pt-2">
              Màu sắc nên ứng dụng vào trang phục, vật dụng cá nhân, nội thất, xe cộ để hỗ trợ vượng khí bản mệnh.
            </p>
          </div>

          <AdSlot label="Ad slot — màu hợp mệnh" className="mt-6" />

          <div className="mt-6">
            <Link href={`/${year}-menh-gi`} className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors inline-block">
              Xem chi tiết mệnh, hướng hợp, nghề nghiệp →
            </Link>
          </div>

          <MenhPhongThuyLinks year={year} exclude="mau" />

          <div className="mt-8">
            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (type === 'da') {
    const title = `Sinh năm ${year} hợp đá phong thủy nào? — Mệnh ${menh.hanh}`;
    const desc = `Người sinh năm ${year} (${menh.canChi}) mệnh ${menh.hanh} hợp với các loại đá: ${daInfo.daHop.join(', ')}.`;
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={desc} />
        </Head>
        <Header />
        <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
          <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Gem size={26} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{title}</h1>

          <div className="mystic-card p-6 space-y-5">
            <p className="text-center text-moon">
              Năm sinh <strong className="text-gold-soft">{menh.canChi}</strong> — Mệnh{' '}
              <strong className="text-gold-soft text-xl">{menh.hanh}</strong> ({menh.napAm})
            </p>

            <div>
              <p className="text-jade font-semibold mb-3">Đá hợp mệnh</p>
              <div className="flex flex-wrap gap-2">
                {daInfo.daHop.map((d) => (
                  <span key={d} className="px-3 py-1.5 rounded-full bg-ink-soft border border-jade/30 text-sm">{d}</span>
                ))}
              </div>
            </div>

            <div className="mystic-divider pt-4">
              <p className="text-parchment/85">{daInfo.moTa}</p>
            </div>

            <div className="mystic-divider pt-4">
              <p className="text-gold-soft font-semibold mb-1">Công dụng phong thủy</p>
              <p className="text-parchment/85">{daInfo.congDung}</p>
            </div>

            <p className="text-xs text-moon/60 pt-2">
              Đá phong thủy nên chọn kích thước phù hợp để đeo tay/cổ, hoặc đặt tại bàn làm việc, không gian sống để hỗ trợ năng lượng bản mệnh.
            </p>
          </div>

          <AdSlot label="Ad slot — đá phong thủy" className="mt-6" />

          <MenhPhongThuyLinks year={year} exclude="da" />

          <div className="mt-8">
            <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // type === 'hop-tuoi'
  const title = `Sinh năm ${year} hợp tuổi nào? — Tuổi ${tuoiHop.chi}`;
  const desc = `Người sinh năm ${year} (tuổi ${tuoiHop.chi}) hợp nhất với tuổi ${tuoiHop.hopTuoi.join(', ')}, cần lưu ý với tuổi ${tuoiHop.xungTuoi.join(', ')}.`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{title}</h1>
        <div className="mystic-card p-6 space-y-4">
          <div>
            <p className="text-jade font-semibold mb-2">Tam hợp (hợp nhất):</p>
            <div className="flex gap-2 flex-wrap">
              {tuoiHop.hopTuoi.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-jade/40 text-sm">
                  Tuổi {c} ({getYearsForChi(c, year).join(', ')})
                </span>
              ))}
            </div>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-vermilion font-semibold mb-2">Tứ hành xung (nên cân nhắc):</p>
            <div className="flex gap-2 flex-wrap">
              {tuoiHop.xungTuoi.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-ink-soft border border-vermilion/40 text-sm">
                  Tuổi {c} ({getYearsForChi(c, year).join(', ')})
                </span>
              ))}
            </div>
          </div>
          {tuoiHop.hai && (
            <p className="text-sm text-moon">Lục hại: cần lưu ý thêm với tuổi <strong className="text-parchment">{tuoiHop.hai}</strong>.</p>
          )}
        </div>
        <AdSlot label="Ad slot — tuổi hợp" className="mt-6" />

        <TuoiHopLinks exclude="tuoi-hop" />

        <div className="mt-8">
          <FaqSection faqs={FAQ_TUOI_HOP} />
        </div>

        <div className="mt-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>
      </main>
      <Footer />
    </>
  );
}
