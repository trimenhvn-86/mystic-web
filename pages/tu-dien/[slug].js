import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { getDictionaryTerms, getDictionaryTermBySlug } from '../../lib/sanity';

export async function getStaticPaths() {
  const terms = await getDictionaryTerms();
  return { paths: terms.map((t) => ({ params: { slug: t.slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const term = await getDictionaryTermBySlug(params.slug);
  if (!term) return { notFound: true };
  return { props: { term }, revalidate: 86400 };
}

export default function TuDienDetail({ term }) {
  return (
    <>
      <Head>
        <title>{term.title} là gì? — Từ điển huyền học TriMenh</title>
        <meta name="description" content={term.shortDefinition} />
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={26} className="text-gold" />
        </div>
        <Breadcrumb trail={[{ label: 'Từ điển', href: '/tu-dien' }]} current={term.title} />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{term.title}</h1>
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
                  <Link key={rt} href={`/tu-dien/${rt}`} className="px-3 py-1 rounded-full bg-ink-soft border border-ink-line text-sm hover:border-gold/40 transition-colors">
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
      <Footer />
    </>
  );
}
