import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiHeart, FiShoppingBag, FiShare2 } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    let foundProduct = null;
    let usingMock = false;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw error;
      }
      foundProduct = data;
    } catch (err) {
      usingMock = true;
      // Fallback to mock data
      if (typeof id === 'string') {
        foundProduct = MOCK_PRODUCTS.find(p => p.id === id) || null;
      }
    }

    if (foundProduct) {
      setProduct(foundProduct);
      if (usingMock) {
         toast('Demo Mode: Using offline data', { icon: '⚠️' });
      }
    } else {
        // If not found in DB AND not found in mock
        toast.error('Product not found');
    }
    
    setLoading(false);
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product) {
        addToCart(product.id, 1);
    }
  };

  if (loading) return <Layout><div className="p-10 text-center animate-pulse">Loading product details...</div></Layout>;
  if (!product) return <Layout><div className="p-10 text-center">Product not found</div></Layout>;

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <Layout title={product.title}>
      <div className="pb-24 md:pb-10">
        {/* Image */}
        <div className="w-full aspect-[3/4] md:aspect-video md:h-[500px] bg-gray-100 relative">
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover md:object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary shadow-md">
            <FiShare2 />
          </button>
        </div>

        <div className="px-4 py-6 md:max-w-3xl md:mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-secondary mb-1">{product.title}</h1>
            <p className="text-sm text-muted">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-white border border-border rounded-lg">
            <span className="text-2xl font-bold text-secondary">₹{product.price}</span>
            {product.original_price && (
              <>
                <span className="text-sm text-muted line-through">₹{product.original_price}</span>
                <span className="text-sm font-bold text-orange-500">({discount}% OFF)</span>
              </>
            )}
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-medium transition-all ${
                    selectedSize === size 
                      ? 'border-primary text-primary ring-1 ring-primary' 
                      : 'border-border text-secondary hover:border-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions - Sticky on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border flex gap-3 md:relative md:border-0 md:p-0 md:bg-transparent z-40 pb-safe">
            <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-md border border-border text-secondary font-bold uppercase text-sm tracking-wide">
              <FiHeart /> Wishlist
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-md bg-primary text-white font-bold uppercase text-sm tracking-wide shadow-lg shadow-primary/30"
            >
              <FiShoppingBag /> Add to Bag
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}