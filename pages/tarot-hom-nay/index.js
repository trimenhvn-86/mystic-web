import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Sparkles, Share2 } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardFlip from '../../components/TarotCardFlip';
import HubContentPreview from '../../components/HubContentPreview';
import { getDailyCard } from '../../lib/tarot';
import { getHubContentPreview } from '../../lib/sanity';

const SUIT_LABEL = { wands: 'Gậy', cups: 'Cốc', swords: 'Kiếm', pentacles: 'Tiền' };

function toRoman(num) {
  if (num === 0) return '0';
  const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let n = num, r = '';
  for (const [v, s] of map) { while (n >= v) { r += s; n -= v; } }
  return r;
}

export async function getStaticProps() {
  const today = new Date();
  const dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  const { card, upright } = getDailyCard(dd, mm, yyyy);
  const preview = await getHubContentPreview('tarot');
  return {
    props: { card, upright, dateStr: `${dd}/${mm}/${yyyy}`, ...preview },
    revalidate: 86400
  };
}

export default function TarotHomNay({ card, upright, dateStr, dictionaryPreview, guidePreview }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 500);
    return () => clearTimeout(t);
  }, []);

  const dailyMsg = upright ? card.dailyMessageUpright : card.dailyMessageReversed;
  const keywords = upright ? card.keywordsUpright : card.keywordsReversed;
  const title = `Tarot Hôm Nay ${dateStr} — ${card.nameVi} (${upright ? 'Xuôi' : 'Ngược'})`;
  const metaLine = card.arcana === 'major'
    ? `Ẩn Chính — Số ${toRoman(card.number)}`
    : `Ẩn Phụ — Bộ ${SUIT_LABEL[card.suit]} — Số ${card.number}`;

  function handleShare() {
    const shareText = `Tarot hôm nay ${dateStr}: lá ${card.nameVi} (${upright ? 'Xuôi' : 'Ngược'}). Xem đầy đủ tại https://trimenh.com/tarot-hom-nay`;
    if (navigator.share) {
      navigator.share({ title: title, text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Đã sao chép nội dung chia sẻ vào clipboard!');
    }
  }

  return (
    <>
      <Head>
        <title>{title} — TriMenh</title>
        <meta name="description" content={`Tarot hôm nay ${dateStr}: lá ${card.nameVi} (${upright ? 'Xuôi' : 'Ngược'}). ${dailyMsg}`} />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tarot', href: '/tarot' }]} current="Tarot hôm nay" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tarot Hôm Nay</h1>
        <p className="text-moon/70 text-sm text-center mb-8">{dateStr} — lá bài chung cho hôm nay</p>

        <div className="flex justify-center mb-6">
          <TarotCardFlip card={card} upright={upright} flipped={flipped} onFlip={() => {}} responsive hint={false} />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-gold-soft">{card.nameVi}</h2>
          <p className="text-sm text-moon">{card.nameEn}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-ink-soft border border-ink-line text-moon">{metaLine}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${upright ? 'border-jade/40 text-jade' : 'border-vermilion/40 text-vermilion'}`}>
              {upright ? 'Xuôi' : 'Ngược'}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {keywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-ink-soft border border-ink-line text-xs text-moon">{k}</span>
            ))}
          </div>
        </div>

        <div className="mystic-card p-6 space-y-4">
          <div>
            <p className="text-gold-soft font-semibold mb-1">Thông điệp hôm nay</p>
            <p className="text-parchment/90">{dailyMsg}</p>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-gold-soft font-semibold mb-1">Điều nên làm</p>
            <p className="text-parchment/85 text-sm">
              {upright ? 'Tin tưởng vào năng lượng tích cực của lá bài, chủ động hành động theo thông điệp hôm nay.' : 'Chậm lại, quan sát kỹ hơn trước khi quyết định, tránh phản ứng vội vàng.'}
            </p>
          </div>
          <div className="mystic-divider pt-4">
            <p className="text-gold-soft font-semibold mb-1">Điều cần lưu ý</p>
            <p className="text-parchment/85 text-sm">
              {upright ? 'Vẫn nên giữ sự cân bằng, không nên quá tự tin thái quá.' : 'Cần thêm thời gian và sự kiên nhẫn, không nên ép buộc kết quả.'}
            </p>
          </div>
        </div>

        <AdSlot label="Ad slot — tarot hôm nay" className="mt-6" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/tarot/${card.slug}`} className="inline-block px-5 py-3 rounded-full bg-gold text-ink text-sm font-semibold hover:opacity-90 transition-opacity">
            Khám phá toàn bộ ý nghĩa lá {card.nameVi} →
          </Link>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-3 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">
            <Share2 size={15} /> Chia sẻ
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-moon mb-3 text-center">Công cụ liên quan:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/rut-la-tarot" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Rút 1 lá bài</Link>
            <Link href="/tarot-yes-no" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot Yes/No</Link>
            <Link href="/tarot/bo-bai" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Bộ bài 78 lá</Link>
            <Link href="/trai-bai-3-la" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Trải bài 3 lá</Link>
          </div>
        </div>

        <div className="mt-8">
          <HubContentPreview dictionaryPreview={dictionaryPreview} guidePreview={guidePreview} />
        </div>

        <p className="text-xs text-moon/50 mt-6 text-center">
          Tarot mang tính tham khảo, chiêm nghiệm — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
