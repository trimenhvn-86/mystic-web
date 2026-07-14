import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { getGuidePosts, getGuidePostBySlug } from '../../lib/sanity';

const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="font-display text-xl text-parchment mt-6 mb-3">{children}</h2>,
    normal: ({ children }) => <p className="text-parchment/85 leading-relaxed mb-4">{children}</p>
  }
};

export async function getStaticPaths() {
  const posts = await getGuidePosts();
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getGuidePostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 86400 };
}

export default function CamNangDetail({ post }) {
  const seoTitle = post.seoTitle || `${post.title} — Cẩm nang TriMenh`;
  const seoDescription = post.seoDescription || post.excerpt;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {post.featuredImageUrl && <meta property="og:image" content={post.featuredImageUrl} />}
      </Head>
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        {post.featuredImageUrl ? (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
              priority
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-ink-soft border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={26} className="text-gold" />
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{post.title}</h1>
        <div className="mystic-card p-6">
          {post.htmlContent ? (
            // eslint-disable-next-line react/no-danger
            <div className="cam-nang-html" dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
          ) : post.body ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : (
            <p className="text-moon">{post.excerpt}</p>
          )}
        </div>
        <AdSlot label="Ad slot — cẩm nang" className="mt-6" />
        <Link href="/cam-nang" className="block text-center text-sm text-moon hover:text-gold-soft mt-6">← Về Cẩm nang</Link>
      </main>
      <Footer />
    </>
  );
}
