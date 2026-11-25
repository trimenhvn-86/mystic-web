import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import SidebarTools from '../../components/SidebarTools';
import AdSlot from '../../components/AdSlot';
import { getDictionaryTerms, getDictionaryTermBySlug } from '../../lib/content';

export async function getStaticPaths() {
  let terms = [];
  try { terms = await getDictionaryTerms(); } catch (e) { terms = []; }
  return { paths: terms.map((t) => ({ params: { slug: t.slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const term = await getDictionaryTermBySlug(params.slug);
  if (!term) return { notFound: true, revalidate: 300 };
  return { props: { term }, revalidate: 3600 };
}

export default function TuDienDetail({ term }) {
  const termSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.title,
    description: term.shortDefinition,
    url: `https://trimenh.com/tu-dien/${term.slug}`,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Từ điển huyền học TriMenh', url: 'https://trimenh.com/tu-dien' }
  };
  return (
    <>
      <Head>
        <title>{`${term.title} là gì? — Từ điển huyền học TriMenh`}</title>
        <meta name="description" content={term.shortDefinition} />
        <meta property="og:title" content={`${term.title} là gì? — Từ điển huyền học TriMenh`} />
        <meta property="og:description" content={term.shortDefinition} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termSchema) }} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-12 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
        <main className="min-w-0 max-w-3xl">
        <Breadcrumb trail={[{ label: 'Từ điển', href: '/tu-dien' }]} current={term.title} />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-parchment mb-6">{term.title}</h1>
        <div className="mystic-card p-6 space-y-5">
          <p className="text-lg text-gold-soft">{term.shortDefinition}</p>
          {term.origin && (
            <div className="mystic-divider pt-4">
              <p className="text-jade font-semibold mb-1">Nguồn gốc</p>
              <p className="text-parchment/85">{term.origin}</p>
            </div>
          )}
          {term.meaning && (
            <div className="mystic-divider pt-4">
              <p className="text-jade font-semibold mb-1">Ý nghĩa</p>
              <p className="text-parchment/85">{term.meaning}</p>
            </div>
          )}
          {term.application && (
            <div className="mystic-divider pt-4">
              <p className="text-jade font-semibold mb-1">Ứng dụng</p>
              <p className="text-parchment/85">{term.application}</p>
            </div>
          )}
          {term.example && (
            <div className="mystic-divider pt-4">
              <p className="text-jade font-semibold mb-1">Ví dụ</p>
              <p className="text-parchment/85">{term.example}</p>
            </div>
          )}
          {term.relatedTerms?.length > 0 && (
            <div className="mystic-divider pt-4">
              <p className="text-jade font-semibold mb-2">Thuật ngữ liên quan</p>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((rt) => (
                  <Link key={rt} href={`/tu-dien/${rt}`} className="px-3 py-1 rounded bg-ink-soft border border-ink-line text-sm hover:border-lich transition-colors">
                    {rt}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <AdSlot label="Ad slot — từ điển" className="mt-6" />
        <Link href="/tu-dien" className="block text-center text-sm text-moon hover:text-gold-soft mt-6">← Về Từ điển huyền học</Link>
      </main>
        <SidebarTools seed="tu-dien" />
      </div>
      <Footer />
    </>
  );
}
