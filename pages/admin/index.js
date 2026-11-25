import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';

const box = 'bg-white border border-[#D3CFC0] rounded-md';
const input = 'w-full border border-[#D3CFC0] rounded-md px-3 py-2 bg-white text-[#1B1B24]';
const btn = 'bg-[#C42B1C] text-white font-semibold rounded-md px-4 py-2 disabled:opacity-50';
const btn2 = 'border border-[#1B1B24] text-[#1B1B24] font-semibold rounded-md px-4 py-2 disabled:opacity-50';

export default function Admin() {
  const [st, setSt] = useState(null);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('send');
  const [subs, setSubs] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [testTo, setTestTo] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  const loadStatus = useCallback(async () => { setSt(await (await fetch('/api/admin/status')).json()); }, []);
  const loadSubs = useCallback(async () => { const r = await fetch('/api/admin/subscribers'); if (r.ok) setSubs(await r.json()); }, []);
  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => { if (st && st.loggedIn) loadSubs(); }, [st, loadSubs]);

  async function login(e) {
    e.preventDefault(); setErr('');
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Không đăng nhập được.'); return; }
    setPw(''); loadStatus();
  }
  async function logout() { await fetch('/api/admin/login', { method: 'DELETE' }); loadStatus(); }

  async function makeDraft() {
    setMsg('');
    const r = await fetch('/api/admin/draft');
    const d = await r.json();
    if (r.ok) { setSubject(d.subject); setBody(d.body); setMsg(`Đã tạo nháp cho tháng ${d.mm}/${d.yyyy}. Bạn đọc lại, sửa nếu muốn.`); }
  }
  async function sendTest() {
    setBusy(true); setMsg('');
    const r = await fetch('/api/admin/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'test', subject, body, testTo }) });
    const d = await r.json();
    setMsg(r.ok ? `Đã gửi thử tới ${testTo}. Kiểm tra cả thư rác.` : d.error); setBusy(false);
  }
  async function sendAll() {
    const n = subs && subs.counts ? subs.counts.active || 0 : 0;
    if (!n) { setMsg('Chưa có người đăng ký đã xác nhận.'); return; }
    if (!window.confirm(`Gửi email này cho ${n} người đã xác nhận? Không thu hồi được.`)) return;
    setBusy(true); setMsg(''); let offset = 0; const totals = { sent: 0, failed: 0 };
    try {
      while (offset !== null) {
        const r = await fetch('/api/admin/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'all', subject, body, offset, totals }) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Lỗi gửi');
        totals.sent += d.sent; totals.failed += d.failed.length; offset = d.next;
        setProgress(`Đã gửi ${totals.sent}/${d.total}${totals.failed ? `, lỗi ${totals.failed}` : ''}`);
      }
      setMsg(`Xong. Gửi thành công ${totals.sent}, lỗi ${totals.failed}.`); loadSubs();
    } catch (e) { setMsg(`Dừng giữa chừng: ${e.message}. Đã gửi ${totals.sent}. Đừng bấm gửi lại ngay, kiểm tra SMTP2GO trước để tránh gửi trùng.`); }
    setBusy(false);
  }

  if (!st) return <p className="p-6">Đang tải…</p>;
  return (
    <div className="min-h-screen bg-[#F7F6F1] text-[#1B1B24]">
      <Head><title>Quản trị — TriMenh</title><meta name="robots" content="noindex,nofollow" /></Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quản trị email TriMenh</h1>
          {st.loggedIn && <button onClick={logout} className={btn2}>Đăng xuất</button>}
        </div>

        {!st.loggedIn && (
          <form onSubmit={login} className={`${box} p-5 max-w-sm`}>
            {!st.adminConfigured && <p className="text-sm text-[#A8231B] mb-3">Chưa đặt biến ADMIN_PASSWORD trên Vercel nên chưa đăng nhập được.</p>}
            <label className="block text-sm mb-1" htmlFor="pw">Mật khẩu quản trị</label>
            <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} autoComplete="current-password" />
            {err && <p role="alert" className="text-sm text-[#A8231B] mt-2">{err}</p>}
            <button className={`${btn} mt-4 w-full`}>Đăng nhập</button>
          </form>
        )}

        {st.loggedIn && (
          <>
            <div className={`${box} p-4 mb-5 text-sm grid sm:grid-cols-3 gap-2`}>
              <p>Lưu danh sách (Redis): <b>{st.redis ? 'đã kết nối' : 'CHƯA kết nối'}</b></p>
              <p>Gửi mail (SMTP2GO): <b>{st.smtp ? 'đã có key' : 'CHƯA có key'}</b></p>
              <p>Người gửi: <b>{st.sender}</b></p>
              <p className="sm:col-span-3">Tự gửi ngày 25 hằng tháng: <b>{st.autoSend ? 'ĐANG BẬT' : 'đang tắt'}</b></p>
            </div>
            <div className="flex gap-2 mb-5">
              {[['send', 'Soạn và gửi'], ['subs', `Người đăng ký${subs && subs.counts ? ` (${subs.counts.active || 0})` : ''}`]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={tab === id ? btn : btn2}>{label}</button>
              ))}
            </div>

            {tab === 'send' && (
              <div className={`${box} p-5 space-y-4`}>
                <div className="flex flex-wrap gap-2 items-center">
                  <button onClick={makeDraft} className={btn2}>Tạo nháp lịch tháng tới</button>
                  <span className="text-sm text-[#55555F]">Lấy số liệu thật của tháng sau từ hệ thống lịch.</span>
                </div>
                <div>
                  <label className="block text-sm mb-1" htmlFor="sj">Tiêu đề</label>
                  <input id="sj" value={subject} onChange={(e) => setSubject(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="block text-sm mb-1" htmlFor="bd">Nội dung</label>
                  <textarea id="bd" rows={16} value={body} onChange={(e) => setBody(e.target.value)} className={`${input} font-mono text-sm`} />
                  <p className="text-xs text-[#55555F] mt-1">Dòng trống tách đoạn. “## Tiêu đề” là tiêu đề nhỏ. “- ” đầu dòng là gạch đầu dòng. [chữ](https://link) là liên kết.</p>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[14rem]">
                    <label className="block text-sm mb-1" htmlFor="tt">Gửi thử tới email</label>
                    <input id="tt" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} className={input} placeholder="email của bạn" />
                  </div>
                  <button disabled={busy || !subject || !body} onClick={sendTest} className={btn2}>Gửi thử</button>
                  <button disabled={busy || !subject || !body || !st.redis} onClick={sendAll} className={btn}>Gửi cho tất cả</button>
                </div>
                {progress && busy && <p className="text-sm">{progress}</p>}
                {msg && <p role="status" className="text-sm font-medium">{msg}</p>}
              </div>
            )}

            {tab === 'subs' && (
              <div className={`${box} p-5`}>
                {!subs || !subs.configured ? <p>Chưa kết nối Upstash Redis nên chưa có danh sách.</p> : (
                  <>
                    <p className="text-sm mb-3">Đã xác nhận: <b>{subs.counts.active || 0}</b> · Chờ xác nhận: <b>{subs.counts.pending || 0}</b> · Đã hủy: <b>{subs.counts.unsubscribed || 0}</b></p>
                    <a href="/api/admin/subscribers?format=csv" className={`${btn2} inline-block mb-4`}>Tải file CSV</a>
                    <div className="overflow-x-auto"><table className="w-full text-sm">
                      <thead><tr className="text-left border-b border-[#D3CFC0]"><th className="py-2 pr-3">Email</th><th className="pr-3">Trạng thái</th><th>Ngày đăng ký</th></tr></thead>
                      <tbody>{subs.list.map((s) => (
                        <tr key={s.email} className="border-b border-[#EDEBE2]"><td className="py-2 pr-3 break-all">{s.email}</td><td className="pr-3">{{ active: 'Đã xác nhận', pending: 'Chờ xác nhận', unsubscribed: 'Đã hủy' }[s.status] || s.status}</td><td>{String(s.createdAt || '').slice(0, 10)}</td></tr>
                      ))}</tbody></table></div>
                    {subs.campaigns.length > 0 && (
                      <>
                        <h2 className="font-bold mt-6 mb-2">Các lần gửi gần đây</h2>
                        <ul className="text-sm space-y-1">{subs.campaigns.map((c, i) => <li key={i}>{String(c.at).slice(0, 16).replace('T', ' ')} UTC: {c.subject} (gửi {c.sent}, lỗi {c.failed}){c.auto ? ' [tự động]' : ''}</li>)}</ul>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
