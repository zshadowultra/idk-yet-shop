import Head from 'next/head';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'DesiThreads - Indian Fashion Store' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Premium Indian fashion e-commerce store with the latest trends" />
      </Head>
      <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0">
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--surface)',
              color: 'var(--secondary)',
              border: '1px solid var(--border)',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
        <BottomNav />
      </div>
    </>
  );
}
