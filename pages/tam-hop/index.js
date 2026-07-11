import Head from 'next/head';
import Link from 'next/link';
import { Users } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import data from '../../content/phong-thuy/tuoi-hop/tam-hop-tu-hanh-xung.json';

export default function TamHop() {
  return (
    <>
      <Head>
        <title>Tam Hợp Là Gì? Bảng Tra Cứu 4 Nhóm Tam Hợp Địa Chi — TriMenh</title>
        <meta name="description" content="Tam hợp là gì? Tra cứu đầy đủ 4 nhóm Tam hợp Địa Chi: Tý-Thìn-Thân, Sửu-Tỵ-Dậu, Dần-Ngọ-Tuất, Mão-Mùi-Hợi." />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Users size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">Tam Hợp Là Gì?</h1>

        <div className="mystic-card p-6 mb-6 text-parchment/85 leading-relaxed">
          <p>
            Tam hợp là nhóm 3 Địa Chi có mối quan hệ hỗ trợ, hòa hợp lẫn nhau theo tam giác cách đều nhau 4 vị trí
            trong vòng 12 con giáp. Người có tuổi thuộc cùng nhóm Tam hợp thường được xem là hợp nhau trong công việc,
            hôn nhân và các mối quan hệ hợp tác lâu dài.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {data.tamHop.map((group, i) => (
            <div key={i} className="mystic-card p-5">
              <p className="text-xs text-moon uppercase mb-2">Nhóm {i + 1}</p>
              <div className="flex flex-wrap gap-2">
                {group.map((chi) => (
                  <span key={chi} className="px-3 py-1.5 rounded-full bg-ink-soft border border-jade/40 text-sm text-jade">Tuổi {chi}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AdSlot label="Ad slot — tam hợp" className="mb-6" />

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">
            Muốn xem cụ thể năm sinh của bạn thuộc nhóm nào, hợp với tuổi nào theo đúng năm sinh?
          </p>
          <Link href="/tuoi-hop" className="inline-block mt-3 text-sm text-gold-soft hover:underline">
            Tra cứu tuổi hợp theo năm sinh →
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
