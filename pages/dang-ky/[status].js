import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TEXT = {
  'xac-nhan': ['Đã xác nhận', 'Cảm ơn bạn. Từ giờ bạn sẽ nhận lịch ngày tốt hằng tháng. Chúng tôi vừa gửi một email chào mừng.'],
  huy: ['Đã hủy nhận email', 'Bạn sẽ không nhận email từ TriMenh nữa. Nếu bấm nhầm, bạn có thể đăng ký lại bất cứ lúc nào ở cuối trang chủ.'],
  loi: ['Liên kết không dùng được', 'Liên kết đã hết hạn hoặc không đúng. Bạn thử đăng ký lại ở cuối trang chủ.']
};

export async function getStaticPaths() { return { paths: Object.keys(TEXT).map((status) => ({ params: { status } })), fallback: false }; }
export async function getStaticProps({ params }) { return { props: { status: params.status } }; }

export default function Status({ status }) {
  const [title, text] = TEXT[status];
  return (
    <>
      <Head><title>{title} — TriMenh</title><meta name="robots" content="noindex,nofollow" /></Head>
      <Header />
      <main className="max-w-xl mx-auto px-5 py-16">
        <h1 className="font-display font-extrabold text-3xl text-parchment mb-3">{title}</h1>
        <p className="text-moon leading-relaxed mb-6">{text}</p>
        <Link href="/" className="btn-gold px-5 py-3 inline-block">Về trang chủ</Link>
      </main>
      <Footer />
    </>
  );
}
