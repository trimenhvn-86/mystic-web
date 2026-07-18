import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CircleDot, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TarotCardFlip from '../../components/TarotCardFlip';
import HubContentPreview from '../../components/HubContentPreview';
import { getRandomCard } from '../../lib/tarot';
import { trackToolUse } from '../../lib/analytics';
import { getHubContentPreview } from '../../lib/sanity';

const STORAGE_KEY = 'trimenh_rut_la_tarot';

export async function getStaticProps() {
  const preview = await getHubContentPreview('tarot');
  return { props: preview, revalidate: 86400 };
}

export default function RutLaTarot({ dictionaryPreview, guidePreview }) {
  const [result, setResult] = useState(null); // { card, upright }
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed);
      setFlipped(true);
    }
  }, []);

  function handleDraw() {
    const drawn = getRandomCard();
    setResult(drawn);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(drawn));
    trackToolUse('rut_la_tarot', { card_name: drawn.card.nameVi });
  }

  function handleFlip() {
    if (!result) handleDraw();
    setFlipped(true);
  }

  function handleRedraw() {
    sessionStorage.removeItem(STORAGE_KEY);
    setResult(null);
    setFlipped(false);
  }

  const meaning = result ? (result.upright ? result.card.meaningUpright : result.card.meaningReversed) : null;
  const dailyMsg = result ? (result.upright ? result.card.dailyMessageUpright : result.card.dailyMessageReversed) : null;

  return (
    <>
      <Head>
        <title>Rút 1 Lá Tarot — TriMenh</title>
        <meta name="description" content="Rút ngẫu nhiên 1 lá Tarot và xem thông điệp dành cho bạn ngay lúc này." />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <CircleDot size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tarot', href: '/tarot' }]} current="Rút 1 lá" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-1 text-center">Rút 1 Lá Tarot</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Tĩnh tâm, đặt câu hỏi trong đầu, rồi bấm vào lá bài để rút</p>

        <TarotCardFlip
          card={result?.card}
          upright={result?.upright}
          flipped={flipped}
          onFlip={handleFlip}
          size={200}
        />

        {flipped && result && (
          <>
            <div className="text-center mt-6 mb-6">
              <h2 className="font-display text-2xl text-gold-soft">{result.card.nameVi}</h2>
              <p className="text-sm text-moon">{result.card.nameEn} — {result.upright ? 'Xuôi' : 'Ngược'}</p>
            </div>

            <div className="mystic-card p-6 space-y-4">
              <div>
                <p className="text-gold-soft font-semibold mb-1">Ý nghĩa</p>
                <p className="text-parchment/85 text-sm">{meaning}</p>
              </div>
              <div className="mystic-divider pt-4">
                <p className="text-gold-soft font-semibold mb-1">Thông điệp dành cho bạn</p>
                <p className="text-parchment/90">{dailyMsg}</p>
              </div>
            </div>

            <AdSlot label="Ad slot — rút lá tarot" className="mt-6" />

            <div className="flex justify-center mt-6">
              <button
                onClick={handleRedraw}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors"
              >
                <RotateCcw size={15} /> Rút lại
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href={`/tarot/${result.card.slug}`} className="text-sm text-gold-soft hover:underline">
                Xem ý nghĩa đầy đủ của lá {result.card.nameVi} →
              </Link>
            </div>
          </>
        )}

        <div className="mt-8">
          <p className="text-sm text-moon mb-3 text-center">Công cụ liên quan:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tarot-hom-nay" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tarot hôm nay</Link>
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
