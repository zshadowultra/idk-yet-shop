import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CategoryRail from '@/components/CategoryRail';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
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
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 py-12">
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary">Shop by Category</h2>
              <p className="text-muted text-sm mt-1">Explore our curated collections</p>
            </div>
          </div>
          <CategoryRail />
        </section>

        {/* Featured Brands */}
        <section className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-3xl p-8 border border-border/50">
          <h3 className="text-center font-bold text-secondary text-sm uppercase tracking-widest mb-8">Featured Partners</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levis'].map((brand, idx) => (
              <div key={idx} className="flex items-center justify-center">
                <img src={`https://placehold.co/120x40/transparent/333?text=${brand}`} alt={brand} className="h-8 object-contain" />
              </div>
            ))}
          </div>
        </section>

        {/* Fresh Arrivals */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">New Season</span>
              <h2 className="text-3xl font-bold text-secondary">Fresh Arrivals</h2>
            </div>
            <button className="text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-2">
              View All Products <span className="text-lg">→</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter / Trust */}
        <section className="bg-secondary text-white rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://placehold.co/1200x400/1e293b/FFFFFF?text=noise')] opacity-5 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join the Community</h2>
            <p className="text-gray-300">Subscribe for early access to new drops, exclusive offers, and style tips.</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors">Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
