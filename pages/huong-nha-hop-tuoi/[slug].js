import Head from 'next/head';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import MenhPhongThuyLinks from '../../components/MenhPhongThuyLinks';
import { getCungMenh, getHuongNha } from '../../lib/huongNha';

const SLUG_RE = /^(nam|nu)-(\d{4})$/;

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const m = params.slug.match(SLUG_RE);
  if (!m) return { notFound: true };
  const gender = m[1];
  const year = Number(m[2]);
  if (year < 1900 || year > 2100) return { notFound: true };

  const cungMenh = getCungMenh(year, gender);
  const huong = getHuongNha(cungMenh);
  return { props: { gender, year, cungMenh, huong }, revalidate: 2592000 };
}

export default function HuongNhaResult({ gender, year, cungMenh, huong }) {
  const genderLabel = gender === 'nam' ? 'Nam' : 'Nữ';
  const title = `${genderLabel} sinh năm ${year} hợp hướng nhà nào? — Cung ${cungMenh.ten}`;
  const desc = `${genderLabel} sinh năm ${year} thuộc cung ${cungMenh.ten} (${cungMenh.nhom}), hợp các hướng: ${huong.tot.join(', ')}. Nên tránh hướng: ${huong.xau.join(', ')}.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Compass size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-8 text-center">{title}</h1>

        <div className="mystic-card p-6 text-center mb-6">
          <p className="text-moon text-sm mb-1">{genderLabel} sinh năm {year}</p>
          <p className="font-display text-3xl text-gold-soft mb-2">Cung {cungMenh.ten}</p>
          <p className="text-sm text-moon">Thuộc nhóm <strong className="text-parchment">{cungMenh.nhom}</strong></p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="mystic-card p-5 border-jade/30">
            <p className="text-jade font-semibold mb-3">Hướng hợp (nên chọn)</p>
            <div className="flex flex-wrap gap-2">
              {huong.tot.map((h) => (
                <span key={h} className="px-3 py-1.5 rounded-full bg-ink-soft border border-jade/40 text-sm">{h}</span>
              ))}
            </div>
          </div>
          <div className="mystic-card p-5 border-vermilion/30">
            <p className="text-vermilion font-semibold mb-3">Hướng nên tránh</p>
            <div className="flex flex-wrap gap-2">
              {huong.xau.map((h) => (
                <span key={h} className="px-3 py-1.5 rounded-full bg-ink-soft border border-vermilion/40 text-sm">{h}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">
            Hướng nhà ở đây tính theo hướng cửa chính (hoặc hướng ban công/bàn làm việc nếu không đổi được hướng cửa).
            Nếu nhà đang ở không hợp hướng, có thể hóa giải bằng cách bố trí bàn làm việc, giường ngủ theo hướng hợp mệnh
            thay vì bắt buộc đổi hướng cả căn nhà.
          </p>
        </div>

        <AdSlot label="Ad slot — hướng nhà hợp tuổi" className="mb-6" />

        <MenhPhongThuyLinks year={year} exclude="huong" />

        <p className="text-xs text-moon/50 mt-8 text-center">
          Công thức tham khảo theo Bát Trạch Minh Cảnh — mang tính tham khảo, chiêm nghiệm dân gian, chưa qua kiểm duyệt chuyên gia.
        </p>
      </main>
      <Footer />
    </>
  );
}
