import { useState } from 'react';
import { Check } from 'lucide-react';


/** Ô nhận email gọn, một hàng. Gửi qua Web3Forms như NewsletterCTA. */
export default function EmailStrip({ source = 'chan-trang-chu' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, website: '' })
      });
      const data = await res.json();
      setStatus(res.ok && data.ok ? 'ok' : 'error');
      if (res.ok && data.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return <p role="status" className="flex items-center gap-2 text-sm text-jade font-medium"><Check size={16} /> Gần xong rồi. Mở email chúng tôi vừa gửi và bấm xác nhận (xem cả thư rác).</p>;
  }
  return (
    <div>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor={`email-${source}`}>Địa chỉ email</label>
        <input id={`email-${source}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="email@cuaban.com"
          className="flex-1 min-w-0 bg-white border border-ink-line rounded-md px-3 py-2 text-sm text-parchment focus:border-lich" />
        <button type="submit" disabled={status === 'sending'} className="btn-gold px-4 py-2 text-sm whitespace-nowrap">
          {status === 'sending' ? 'Đang gửi…' : 'Nhận lịch miễn phí'}
        </button>
      </form>
      {status === 'error' && <p role="alert" className="mt-2 text-sm text-vermilion">Chưa gửi được. Bạn thử lại sau một lúc nhé.</p>}
    </div>
  );
}
