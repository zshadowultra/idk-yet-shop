import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CategoryRail from '@/components/CategoryRail';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        throw error;
      }
      
      if (data.length === 0) {
        // DB works but empty
         setProducts(MOCK_PRODUCTS);
         // Optional: toast.success('Demo Mode: Using mock data (DB is empty)');
      } else {
         setProducts(data);
      }

    } catch (err) {
      console.warn('Supabase fetch error, using mock data:', err);
      setProducts(MOCK_PRODUCTS);
      toast('Demo Mode: Database not connected', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <span className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Big Billion Days</span>
          <h1 className="text-2xl md:text-5xl font-black mb-2">50-80% OFF</h1>
          <p className="text-sm md:text-lg opacity-90">On Top International Brands</p>
        </div>
      </div>

      <CategoryRail />

      {/* Featured Brands */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-6 my-2">
         <h3 className="text-center font-bold text-secondary text-sm uppercase tracking-widest mb-4">Featured Brands</h3>
         <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar">
            {['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levis'].map((brand, idx) => (
                <div key={idx} className="flex-shrink-0 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border border-white">
                    <img src={`https://placehold.co/100x100/fff/333?text=${brand}`} alt={brand} className="w-16 h-16 rounded-full object-contain opacity-80" />
                </div>
            ))}
         </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-secondary mb-4 flex items-center justify-between">
          Fresh Arrivals
          <span className="text-xs font-normal text-primary">View All</span>
        </h2>
        
        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
