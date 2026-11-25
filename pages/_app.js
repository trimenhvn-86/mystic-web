import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  let canonicalPath = router.asPath.split('?')[0].split('#')[0];
  // Trang chủ: lúc build Next.js thấy đường dẫn là "/index" => phải ép về "/"
  if (canonicalPath === '/index' || canonicalPath === '') canonicalPath = '/';
  const canonicalUrl = `https://trimenh.com${canonicalPath}`;
  // Trang lỗi (404, 500) không được khai canonical
  const isErrorPage = router.pathname === '/404' || router.pathname === '/_error' || router.pathname === '/500';

  const homeSchema = canonicalPath === '/' ? {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': 'https://trimenh.com/#org', name: 'TriMenh', url: 'https://trimenh.com/', logo: 'https://trimenh.com/brand/og-image.png' },
      { '@type': 'WebSite', '@id': 'https://trimenh.com/#website', url: 'https://trimenh.com/', name: 'TriMenh', inLanguage: 'vi-VN', publisher: { '@id': 'https://trimenh.com/#org' },
        potentialAction: { '@type': 'SearchAction', target: 'https://trimenh.com/tim-kiem?q={search_term_string}', 'query-input': 'required name=search_term_string' } }
    ]
  } : null;

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-403WK7CCSM"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-403WK7CCSM');
          gtag('config', 'GT-TWQ5CGNK');
        `}
      </Script>

      <Head>
        {!isErrorPage && <link rel="canonical" href={canonicalUrl} />}
        {!isErrorPage && <meta property="og:url" content={canonicalUrl} />}
        {isErrorPage && <meta name="robots" content="noindex" />}
        <meta name="google-site-verification" content="4Al67m0IrHmrKDCvrnmwrj2nujRtUbXkhIayyp5Dv08" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#F7F6F1" />
        {homeSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />}
        <meta property="og:site_name" content="TriMenh" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trimenh.com/brand/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          as="style"
          onLoad={(e) => {
            e.currentTarget.rel = 'stylesheet';
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          />
        </noscript>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
