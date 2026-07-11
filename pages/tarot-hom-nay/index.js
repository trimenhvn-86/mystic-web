import Head from 'next/head';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardArt from '../../components/TarotCardArt';
import HubContentPreview from '../../components/HubContentPreview';
import { getDailyCard } from '../../lib/tarot';
import { getHubContentPreview } from '../../lib/sanity';

export async function getStaticProps() {
  const today = new Date();
  const dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  const { card, upright } = getDailyCard(dd, mm, yyyy);
  const preview = await getHubContentPreview('tarot');
  return {
    props: { card, upright, dateStr: `${dd}/${mm}/${yyyy}`, ...preview },
    revalidate: 3600
  };
}

export default function TarotHomNay({ card, upright, dateStr, dictionaryPreview, guidePreview }) {
  const dailyMsg = upright ? card.dailyMessageUpright : card.dailyMessageReversed;
  const keywords = upright ? card.keywordsUpright : card.keywordsReversed;
  const title = `Tarot Hôm Nay ${dateStr} — ${card.nameVi} (${upright ? 'Xuôi' : 'Ngược'})`;

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
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Tarot Hôm Nay</h1>
        <p className="text-moon/70 text-sm text-center mb-8">{dateStr} — lá bài chung cho hôm nay</p>

        <div className="flex justify-center mb-6">
          <TarotCardArt card={card} upright={upright} size={190} />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-gold-soft">{card.nameVi}</h2>
          <p className="text-sm text-moon">{card.nameEn} — {upright ? 'Xuôi' : 'Ngược'}</p>
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

        <div className="mt-6 text-center">
          <Link href={`/tarot/${card.slug}`} className="text-sm text-gold-soft hover:underline">
            Xem ý nghĩa đầy đủ của lá {card.nameVi} →
          </Link>
        </div>

        <div className="mt-6">
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
