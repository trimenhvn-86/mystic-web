import { useState } from 'react';
import Head from 'next/head';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

/**
 * ⚠️ CẦN THAY ACCESS KEY THẬT trước khi dùng:
 * 1. Vào https://web3forms.com → nhập email nhận thông báo → lấy Access Key miễn phí (không cần đăng ký tài khoản).
 * 2. Thay chuỗi "YOUR_WEB3FORMS_ACCESS_KEY" bên dưới bằng Access Key vừa nhận qua email.
 * Trước khi thay, form vẫn hiển thị bình thường nhưng gửi sẽ báo lỗi (vì key giả).
 */
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function LienHe() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          subject: form.subject || 'Liên hệ từ TriMenh.com',
          message: form.message
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Head>
        <title>Liên hệ — TriMenh</title>
        <meta name="description" content="Liên hệ với TriMenh để hợp tác quảng cáo, góp ý nội dung hoặc báo lỗi." />
      </Head>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <Mail size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[]} current="Liên hệ" />
          <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-2 text-center">Liên Hệ</h1>
        <p className="text-moon/70 text-sm text-center mb-8">
          Hợp tác quảng cáo, góp ý nội dung hoặc báo lỗi — gửi cho TriMenh qua form bên dưới.
        </p>

        {status === 'success' ? (
          <div className="mystic-card p-6 text-center">
            <CheckCircle2 size={32} className="text-jade mx-auto mb-3" />
            <p className="text-parchment font-medium mb-1">Đã gửi thành công!</p>
            <p className="text-sm text-moon">TriMenh sẽ phản hồi qua email sớm nhất có thể.</p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-gold-soft hover:underline">Gửi tin nhắn khác</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mystic-card p-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Họ tên
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Email
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Chủ đề
              <input
                type="text" value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Hợp tác quảng cáo / Góp ý / Báo lỗi..."
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-moon min-w-0">
              Nội dung
              <textarea
                required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-ink-soft border border-ink-line rounded-lg px-3 py-3 text-parchment text-base resize-none"
              />
            </label>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-vermilion">
                <XCircle size={16} /> Gửi thất bại — vui lòng thử lại sau ít phút.
              </div>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-gold py-3.5 text-base font-semibold mt-2 disabled:opacity-60">
              {status === 'sending' ? 'Đang gửi...' : 'Gửi liên hệ'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
