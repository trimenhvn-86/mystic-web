import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-4xl text-gold-soft mb-3">404</h1>
        <p className="text-moon mb-6">Vận số trang này chưa được định đoạt — có thể đường dẫn không đúng.</p>
        <Link href="/" className="btn-gold inline-block px-5 py-2.5">Về trang chủ</Link>
      </main>
      <Footer />
    </>
  );
}
