import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import { HUBS, getAllActiveTools } from '../../content/hubs';
import { getDictionaryTerms, getGuidePosts } from '../../lib/content';

export async function getStaticProps() {
  const [terms, posts] = await Promise.all([getDictionaryTerms(), getGuidePosts()]);
  const index = [
    ...HUBS.map((h) => ({ type: 'Hub', title: h.name, href: `/${h.slug}` })),
    ...getAllActiveTools().map((t) => ({ type: 'Công cụ', title: t.label, href: t.href })),
    ...terms.map((t) => ({ type: 'Từ điển', title: t.title, href: `/tu-dien/${t.slug}` })),
    ...posts.map((p) => ({ type: 'Cẩm nang', title: p.title, href: `/cam-nang/${p.slug}` }))
  ];
  return { props: { index }, revalidate: 86400 };
}

export default function TimKiem({ index }) {
  const router = useRouter();
  const [q, setQ] = useState(router.query.q || '');

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return index.filter((item) => item.title.toLowerCase().includes(query)).slice(0, 30);
  }, [q, index]);

  return (
    <>
      <Head>
        <title>Tìm kiếm — TriMenh</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0">
        <Breadcrumb trail={[]} current="Tìm kiếm" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-6">Tìm kiếm</h1>
        <div className="relative mb-6">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-moon" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm công cụ, thuật ngữ, bài viết..."
            className="w-full bg-ink-soft border border-ink-line rounded-md pl-11 pr-4 py-3.5 text-parchment text-base"
          />
        </div>

        {q.trim() === '' ? (
          <p className="text-sm text-moon/60 text-center">Gõ để tìm trong toàn bộ Hub, công cụ, từ điển và cẩm nang.</p>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            {results.map((r) => (
              <Link key={`${r.type}-${r.href}`} href={r.href} className="mystic-card px-4 py-3 flex items-center justify-between hover:border-lich transition-colors">
                <span className="text-parchment">{r.title}</span>
                <span className="text-xs text-moon/60">{r.type}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-moon/60 text-center">Không tìm thấy kết quả phù hợp.</p>
        )}
      </main>
        <SidebarTools seed="tim-kiem-index" />
      </div>
      <Footer />
    </>
  );
}
