import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HeartHandshake } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MysticLoader from '../../components/MysticLoader';

export default function SoSanhTuoiForm() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [yearA, setYearA] = useState(currentYear - 30);
  const [yearB, setYearB] = useState(currentYear - 27);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push(`/so-sanh-tuoi/nam-${yearA}-va-nam-${yearB}`), 1800);
  }

  if (loading) {
    return (
      <>
        <Header />
        <MysticLoader label="Đang đối chiếu Can Chi và Ngũ hành..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>So Sánh Tuổi Hợp — TriMenh Compatibility Score</title>
        <meta name="description" content="So sánh mức độ tương hợp giữa 2 tuổi theo Can Chi, Ngũ hành, Thiên Can — có tính điểm cụ thể." />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <HeartHandshake size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">So Sánh Tuổi Hợp</h1>
        <p className="text-moon/70 text-sm text-center mb-8">Nhập 2 năm sinh để xem điểm tương hợp chi tiết</p>
        <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-moon">
              Năm sinh (Tuổi A)
              <input type="number" min="1900" max="2100" required value={yearA}
                onChange={(e) => setYearA(e.target.value)}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon">
              Năm sinh (Tuổi B)
              <input type="number" min="1900" max="2100" required value={yearB}
                onChange={(e) => setYearB(e.target.value)}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base" />
            </label>
          </div>
          <button type="submit" className="btn-gold py-3.5 text-base font-semibold mt-2">Xem điểm tương hợp</button>
        </form>

        <div className="mt-10">
          <p className="text-sm text-moon mb-3">Công cụ liên quan:</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/tuoi-hop" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Tuổi hợp theo năm sinh</Link>
            <Link href="/menh-phong-thuy" className="px-3 py-1.5 rounded-full border border-ink-line text-sm text-moon hover:border-gold/40 hover:text-gold-soft transition-colors">Mệnh Ngũ hành</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
