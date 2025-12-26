import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export default function Wishlist() {
  // Using MOCK_PRODUCTS to simulate some wishlist items for visual demo
  const wishlistItems = MOCK_PRODUCTS.slice(0, 3);

  return (
    <Layout title="My Wishlist">
      <div className="p-4">
        <h1 className="text-xl font-bold text-secondary mb-2">My Wishlist <span className="text-muted text-sm font-normal">({wishlistItems.length} items)</span></h1>
        
        <div className="space-y-4 mt-6">
          {wishlistItems.map(item => (
             <div key={item.id} className="flex gap-4 bg-white p-3 rounded-lg border border-border shadow-sm">
                <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                   <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                   <div>
                       <h3 className="font-bold text-secondary text-sm line-clamp-2">{item.title}</h3>
                       <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-sm">₹{item.price}</span>
                            <span className="text-xs text-muted line-through">₹{item.original_price}</span>
                            <span className="text-xs text-orange-500 font-bold">(50% OFF)</span>
                       </div>
                   </div>
                   
                   <div className="flex gap-3 mt-3">
                       <button className="flex-1 py-2 rounded border border-border text-xs font-bold uppercase text-secondary">Remove</button>
                       <button className="flex-1 py-2 rounded bg-primary text-white text-xs font-bold uppercase shadow-md shadow-primary/20">Move to Bag</button>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
