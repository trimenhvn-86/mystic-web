import Head from 'next/head';
import Link from 'next/link';
import { Users } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import data from '../../content/phong-thuy/tuoi-hop/tam-hop-tu-hanh-xung.json';

export default function LucHop() {
  return (
    <>
      <Head>
        <title>Lục Hợp Là Gì? Bảng Tra Cứu 6 Cặp Lục Hợp Địa Chi — TriMenh</title>
        <meta name="description" content="Lục hợp là gì? Tra cứu đầy đủ 6 cặp Lục hợp Địa Chi: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Tuổi & Tương Hợp', href: '/tuoi-tuong-hop' }]} current="Lục hợp là gì" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">Lục Hợp Là Gì?</h1>

        <div className="mystic-card p-6 mb-6 text-parchment/85 leading-relaxed">
          <p>
            Lục hợp là quan hệ hòa hợp giữa từng cặp 2 Địa Chi đứng đối diện nhau trên vòng tròn 12 con giáp. Khác với
            Tam hợp (nhóm 3 tuổi), Lục hợp là sự gắn kết theo từng cặp đôi, thường được xem xét khi đánh giá mức độ
            hợp nhau giữa 2 người cụ thể, đặc biệt trong hôn nhân.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {data.lucHop.map((pair, i) => (
            <div key={i} className="mystic-card p-5 flex items-center justify-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-ink-soft border border-jade/40 text-sm text-jade">Tuổi {pair[0]}</span>
              <span className="text-moon">—</span>
              <span className="px-3 py-1.5 rounded-full bg-ink-soft border border-jade/40 text-sm text-jade">Tuổi {pair[1]}</span>
            </div>
          ))}
        </div>

        <AdSlot label="Ad slot — luc hop" className="mb-6" />

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">
            Muốn xem điểm tương hợp cụ thể giữa 2 năm sinh (bao gồm cả Lục hợp, Tam hợp, Ngũ hành)?
          </p>
          <Link href="/so-sanh-tuoi" className="inline-block mt-3 text-sm text-gold-soft hover:underline">
            So sánh tuổi 2 người →
          </Link>
        </div>

        <TuoiHopLinks />

        <p className="text-xs text-moon/50 mt-8 text-center">
          Nội dung mang tính tham khảo, chiêm nghiệm dân gian — không thay thế quyết định cá nhân.
        </p>
      </main>
      <Footer />
    </>
  );
}
