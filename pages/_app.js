import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="4Al67m0IrHmrKDCvrnmwrj2nujRtUbXkhIayyp5Dv08" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0B0E1A" />
        <meta property="og:site_name" content="TriMenh" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trimenh.com/brand/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          as="style"
          onLoad={(e) => {
            e.currentTarget.rel = 'stylesheet';
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          />
        </noscript>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
