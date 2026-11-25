import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { getGuidePosts, getGuidePostBySlug } from '../../lib/content';

const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="font-display text-xl text-parchment mt-6 mb-3">{children}</h2>,
    normal: ({ children }) => <p className="text-parchment/85 leading-relaxed mb-4">{children}</p>
  }
};

export async function getStaticPaths() {
  // Nếu Sanity lỗi lúc build thì không dựng trước trang nào; fallback 'blocking' sẽ dựng khi có người truy cập.
  let posts = [];
  try { posts = await getGuidePosts(); } catch (e) { posts = []; }
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getGuidePostBySlug(params.slug);
  // Sanity lỗi => getGuidePostBySlug ném lỗi => ISR giữ bản cũ. Chỉ khi Sanity trả null (không có bài) mới 404.
  if (!post) return { notFound: true, revalidate: 300 };
  return { props: { post }, revalidate: 3600 };
}

export default function CamNangDetail({ post }) {
  const seoTitle = post.seoTitle || `${post.title} — Cẩm nang TriMenh`;
  const seoDescription = post.seoDescription || post.excerpt;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: seoDescription,
    inLanguage: 'vi-VN',
    mainEntityOfPage: `https://www.trimenh.com/cam-nang/${post.slug}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt || post.publishedAt || undefined,
    ...(post.featuredImageUrl ? { image: post.featuredImageUrl } : {}),
    author: { '@type': 'Organization', name: 'Ban biên soạn TriMenh', url: 'https://www.trimenh.com/ban-bien-soan' },
    publisher: { '@type': 'Organization', name: 'TriMenh', url: 'https://www.trimenh.com/' }
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {post.featuredImageUrl && <meta property="og:image" content={post.featuredImageUrl} />}
        <meta property="og:type" content="article" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
        <Breadcrumb trail={[{ label: 'Cẩm nang', href: '/cam-nang' }]} current={post.title} />
        <h1 className="font-display text-2xl sm:text-3xl text-parchment mb-6 text-center">{post.title}</h1>
        <p className="text-center text-xs text-moon -mt-3 mb-5">
          Biên soạn bởi <Link href="/ban-bien-soan" className="text-gold-soft hover:underline">Ban biên soạn TriMenh</Link>
          {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}` : ''}
          {' · '}<Link href="/phuong-phap-tinh" className="hover:underline">Phương pháp tính</Link>
        </p>
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
