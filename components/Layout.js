import Head from 'next/head';

export default function Layout({ children, title = 'CNOL 2025' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="CNOL 2025 - Congrès National d'Optique Lunetterie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {children}
      </main>
    </>
  );
} 