import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import SidebarTools from '../components/SidebarTools';

export default function BanBienSoan() {
  const title = 'Ban biên soạn — TriMenh';
  const desc = 'TriMenh là nền tảng tra cứu huyền học: lịch âm dương, xem ngày tốt, thần số học, tử vi, tarot. Tìm hiểu cách nhóm biên soạn và nguồn tham khảo.';
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl">
        <Breadcrumb trail={[]} current="Ban biên soạn" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-6">Ban biên soạn TriMenh</h1>
        <div className="mystic-card p-6 space-y-4 text-parchment/85 leading-relaxed">
          <p>TriMenh.com là website tra cứu huyền học phương Đông và phương Tây bằng tiếng Việt: lịch âm dương, xem ngày tốt xấu, giờ hoàng đạo, can chi, thần số học, tử vi và tarot.</p>
          <p>Nội dung do Ban biên soạn TriMenh xây dựng, đối chiếu với các nguồn tham khảo kinh điển và thuật toán lịch công khai. Các bài viết định kỳ được tạo từ dữ liệu tính toán của hệ thống và biên tập lại trước khi đăng.</p>
          <h2 className="font-display text-xl text-parchment pt-2">Nguyên tắc</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Số liệu lịch và ngày giờ tính bằng thuật toán, xem <Link href="/phuong-phap-tinh" className="text-gold-soft hover:underline">Phương pháp tính</Link>.</li>
            <li>Nội dung mang tính tham khảo văn hóa, không thay thế tư vấn y tế, pháp lý, tài chính.</li>
            <li>Phát hiện sai sót, vui lòng báo để chúng tôi sửa.</li>
          </ul>
        </div>
      </main>
        <SidebarTools seed="ban-bien-soan" />
      </div>
      <Footer />
    </>
  );
}
