import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';

/**
 * Khung nhận email. Gửi qua Web3Forms (cùng khóa với trang Liên hệ): mỗi lần đăng ký,
 * chủ site nhận một email "Đăng ký nhận tin" kèm địa chỉ người đăng ký.
 */
export default function NewsletterCTA({ title, text, button = 'Nhận lịch miễn phí', source = 'bai-viet', compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

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

  return (
    <div className="lich-leaf">
      <div className={compact ? 'p-4' : 'p-5 sm:p-6'}>
        <div className="flex items-start gap-3">
          <Mail size={20} className="text-lich flex-shrink-0 mt-1" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display font-bold text-parchment text-lg leading-snug">{title}</p>
            <p className="text-sm text-moon mt-1 leading-relaxed">{text}</p>
          </div>
        </div>
        {status === 'ok' ? (
          <p role="status" className="mt-4 flex items-center gap-2 text-sm text-jade font-medium">
            <Check size={16} /> Đã nhận. Kiểm tra hộp thư của bạn trong ít ngày tới.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor={`email-${source}`}>Địa chỉ email</label>
            <input
              id={`email-${source}`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@cuaban.com"
              autoComplete="email"
              className="flex-1 min-w-0 bg-ink border border-ink-line rounded-md px-3 py-2.5 text-sm text-parchment placeholder:text-moon/60 focus:border-lich"
            />
            <button type="submit" disabled={status === 'sending'} className="btn-gold px-4 py-2.5 text-sm whitespace-nowrap disabled:opacity-60">
              {status === 'sending' ? 'Đang gửi' : button}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p role="alert" className="mt-2 text-xs text-vermilion">Chưa gửi được. Kiểm tra email rồi thử lại, hoặc dùng trang Liên hệ.</p>
        )}
      </div>
    </div>
  );
}
