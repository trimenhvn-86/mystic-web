import Head from 'next/head';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

export default function PhuongPhapTinh() {
  const title = 'Phương pháp tính lịch, ngày tốt xấu — TriMenh';
  const desc = 'Cách TriMenh tính lịch âm dương theo thuật toán Hồ Ngọc Đức, Can Chi, Trực, Sao, giờ Hoàng đạo và tiết khí.';
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <Breadcrumb trail={[]} current="Phương pháp tính" />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">Phương pháp tính của TriMenh</h1>
        <div className="mystic-card p-6 space-y-4 text-parchment/85 leading-relaxed">
          <h2 className="font-display text-xl text-parchment">Lịch âm dương</h2>
          <p>Đổi ngày dương – âm theo thuật toán thiên văn của Hồ Ngọc Đức, múi giờ Việt Nam (UTC+7), có xử lý tháng nhuận.</p>
          <h2 className="font-display text-xl text-parchment">Can Chi, Trực, Sao</h2>
          <p>Can Chi của ngày, tháng, năm suy từ số ngày Julian và chu kỳ 60. Trực xác định theo tiết khí và chi của ngày; Sao nhị thập bát tú theo vòng 28 sao đi theo thứ trong tuần.</p>
          <h2 className="font-display text-xl text-parchment">Giờ Hoàng đạo, ngày Hoàng đạo / Hắc đạo</h2>
          <p>Giờ Hoàng đạo tra theo chi của ngày. Ngày Hoàng đạo / Hắc đạo tra theo tháng âm và chi của ngày. Đây là đánh giá chung, chưa tách riêng từng công việc.</p>
          <h2 className="font-display text-xl text-parchment">Tiết khí</h2>
          <p>24 tiết khí theo kinh độ Mặt Trời.</p>
          <h2 className="font-display text-xl text-parchment">Lưu ý</h2>
          <p>Kết quả mang tính tham khảo văn hóa truyền thống. Các trường phái có thể khác nhau ở một số quy tắc.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
