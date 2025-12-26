import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Cart() {
  return (
    <Layout title="Shopping Bag">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <img 
          src="https://placehold.co/200x200/f5f6f8/ddd?text=Empty+Bag" 
          alt="Empty Cart" 
          className="w-48 h-48 mb-6 opacity-80"
        />
        <h2 className="text-xl font-bold text-secondary mb-2">Hey, it feels so light!</h2>
        <p className="text-muted text-sm mb-8">There is nothing in your bag. Let's add some items.</p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-primary text-white font-bold rounded-md shadow-lg shadow-primary/30 uppercase tracking-wide text-sm"
        >
          Start Shopping
        </Link>
      </div>
    </Layout>
  );
}
