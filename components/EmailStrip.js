import { useState } from 'react';
import { Check } from 'lucide-react';

const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';

/** Ô nhận email gọn, một hàng. Gửi qua Web3Forms như NewsletterCTA. */
export default function EmailStrip({ source = 'chan-trang-chu' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: 'Đăng ký nhận tin từ TriMenh.com',
          from_name: 'TriMenh đăng ký email',
          email,
          message: `Đăng ký nhận email miễn phí. Nguồn: ${source}`
        })
      });
      const data = await res.json();
      setStatus(data.success ? 'ok' : 'error');
      if (data.success) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return <p role="status" className="flex items-center gap-2 text-sm text-jade font-medium"><Check size={16} /> Đã nhận. Kiểm tra hộp thư của bạn trong ít ngày tới.</p>;
  }
  return (
    <div>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor={`email-${source}`}>Địa chỉ email</label>
        <input id={`email-${source}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="email@cuaban.com"
          className="flex-1 min-w-0 bg-white border border-ink-line rounded-md px-3.5 py-2.5 text-parchment focus:border-lich" />
        <button type="submit" disabled={status === 'sending'} className="btn-gold px-5 py-2.5 text-sm whitespace-nowrap">
          {status === 'sending' ? 'Đang gửi…' : 'Nhận lịch miễn phí'}
        </button>
      </form>
      {status === 'error' && <p role="alert" className="mt-2 text-sm text-vermilion">Chưa gửi được. Bạn thử lại sau một lúc nhé.</p>}
    </div>
  );
}
