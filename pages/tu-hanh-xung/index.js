import Head from 'next/head';
import Link from 'next/link';
import { Users } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import AdSlot from '../../components/AdSlot';
import TuoiHopLinks from '../../components/TuoiHopLinks';
import data from '../../content/phong-thuy/tuoi-hop/tam-hop-tu-hanh-xung.json';

export default function TuHanhXung() {
  return (
    <>
      <Head>
        <title>Tứ Hành Xung Là Gì? Bảng Tra Cứu 3 Nhóm Tứ Hành Xung — TriMenh</title>
        <meta name="description" content="Tứ hành xung là gì? Tra cứu đầy đủ 3 nhóm Tứ hành xung Địa Chi: Tý-Ngọ-Mão-Dậu, Dần-Thân-Tỵ-Hợi, Thìn-Tuất-Sửu-Mùi." />
        <meta property="og:title" content={"Tứ Hành Xung Là Gì? Bảng Tra Cứu 3 Nhóm Tứ Hành Xung — TriMenh"} />
        <meta property="og:description" content="Tứ hành xung là gì? Tra cứu đầy đủ 3 nhóm Tứ hành xung Địa Chi: Tý-Ngọ-Mão-Dậu, Dần-Thân-Tỵ-Hợi, Thìn-Tuất-Sửu-Mùi." />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[{ label: 'Tuổi & Tương Hợp', href: '/tuoi-tuong-hop' }]} current="Tứ hành xung là gì" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-6">Tứ Hành Xung Là Gì?</h1>

        <div className="mystic-card p-6 mb-6 text-parchment/85 leading-relaxed">
          <p>
            Tứ hành xung là nhóm 4 Địa Chi đứng cách đều nhau trên vòng tròn 12 con giáp, được xem là có xu hướng
            xung khắc về tính cách và năng lượng. Đây là yếu tố tham khảo, không mang tính tuyệt đối — người thuộc
            nhóm xung khắc vẫn có thể hợp tác, kết hôn tốt nếu biết dung hòa khác biệt.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {data.tuHanhXung.map((group, i) => (
            <div key={i} className="mystic-card p-5">
              <p className="text-xs text-moon mb-2">Nhóm {i + 1}</p>
              <div className="flex flex-wrap gap-2">
                {group.map((chi) => (
                  <span key={chi} className="px-3 py-1.5 rounded bg-ink-soft border border-vermilion/40 text-sm text-vermilion">Tuổi {chi}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AdSlot label="Ad slot — tu hanh xung" className="mb-6" />

        <div className="mystic-card p-6 mb-6">
          <p className="text-sm text-parchment/85">
            Muốn biết chính xác năm sinh của bạn có thuộc Tứ hành xung với ai không?
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
        <SidebarTools seed="tu-hanh-xung-index" />
      </div>
      <Footer />
    </>
  );
}
