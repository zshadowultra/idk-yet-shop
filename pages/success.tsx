import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function Success() {
  return (
    <Layout title="Order Successful">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <FiCheckCircle className="text-6xl text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-secondary mb-2">Order Confirmed!</h1>
        <p className="text-muted text-sm mb-8 max-w-xs mx-auto">
          Thank you for your purchase. Your order has been placed successfully and will be delivered soon.
        </p>
        <div className="flex gap-4">
            <Link 
            href="/orders" 
            className="px-6 py-3 border border-border text-secondary font-bold rounded-md uppercase tracking-wide text-sm"
            >
            View Orders
            </Link>
            <Link 
            href="/" 
            className="px-6 py-3 bg-primary text-white font-bold rounded-md shadow-lg shadow-primary/30 uppercase tracking-wide text-sm"
            >
            Continue Shopping
            </Link>
        </div>
      </div>
    </Layout>
  );
}
