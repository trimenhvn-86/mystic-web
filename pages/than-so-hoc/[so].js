import Head from 'next/head';
import { Hash } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import dictionary from '../../content/numerology/life-path.json';

const CORE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

export async function getStaticPaths() {
  const paths = CORE_NUMBERS.map((n) => ({ params: { so: `so-chu-dao-${n}` } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const match = params.so.match(/^so-chu-dao-(\d{1,2})$/);
  if (!match) return { notFound: true };
  const num = match[1];
  const info = dictionary[num];
  if (!info) return { notFound: true };
  return { props: { num, info } };
}

export default function SoChiTiet({ num, info }) {
  return (
    <>
      <Head>
        <title>{info.ten} — Ý nghĩa Thần Số Học</title>
        <meta name="description" content={info.tongQuan} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Hash size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{info.ten}</h1>
        <div className="mystic-card p-6 space-y-4">
          <p>{info.tongQuan}</p>
          <div className="mystic-divider pt-4">
            <p><strong className="text-gold-soft">Sự nghiệp:</strong> {info.conDuong}</p>
          </div>
          <p><strong className="text-gold-soft">Tình duyên:</strong> {info.tinhDuyen}</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-jade font-semibold mb-1">Điểm mạnh</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {info.diemManh.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-vermilion font-semibold mb-1">Điểm cần lưu ý</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {info.diemYeu.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <AdSlot label="Ad slot — cuối bài" className="mt-6" />
      </main>
      <Footer />
    </>
  );
}
