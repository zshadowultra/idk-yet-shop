import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
        const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
        if (error || !data) throw error;
        
        if (data.length === 0) {
             setProducts(MOCK_PRODUCTS);
        } else {
             setProducts(data);
        }

    } catch (err) {
        console.warn('Admin fetch error:', err);
        setProducts(MOCK_PRODUCTS);
        toast('Demo Mode: Inventory (Database Disconnected)', { icon: '⚠️' });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
            <p className="text-sm text-muted">Manage your inventory</p>
          </div>
          <Link 
            href="/admin/add" 
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md font-medium text-sm"
          >
            <FiPlus /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
            <h3 className="text-muted text-xs uppercase font-bold mb-1">Total Products</h3>
            <p className="text-2xl font-bold text-primary">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
            <h3 className="text-muted text-xs uppercase font-bold mb-1">Orders</h3>
            <p className="text-2xl font-bold text-secondary">0</p>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50">
            <h2 className="font-bold text-secondary">Products</h2>
          </div>
          
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-muted">Loading inventory...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-muted">No products found. Add one to get started.</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-secondary truncate">{p.title}</h4>
                    <p className="text-xs text-muted">Stock: {p.stock} • ₹{p.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-muted hover:text-secondary rounded-full hover:bg-gray-100">
                      <FiEdit2 />
                    </button>
                    <button className="p-2 text-muted hover:text-red-500 rounded-full hover:bg-red-50">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}