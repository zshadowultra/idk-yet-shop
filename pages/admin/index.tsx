import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { FiPlus, FiTrash2, FiEdit2, FiShield, FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account');
      return;
    }
    if (!authLoading && user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
      return;
    }
    if (!authLoading && isAdmin) {
      fetchProducts();
    }
  }, [authLoading, user, isAdmin, router]);

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
      toast('Demo Mode: Using mock data', { icon: '⚠️' });
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || (!isAdmin && user)) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FiShield className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary">Admin Dashboard</h1>
              <p className="text-sm text-muted">Manage your store</p>
            </div>
          </div>
          <Link
            href="/admin/add"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary/20"
          >
            <FiPlus /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiPackage className="text-primary" />
              </div>
              <h3 className="text-muted text-xs uppercase font-bold">Products</h3>
            </div>
            <p className="text-3xl font-bold text-secondary">{products.length}</p>
          </div>
          <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <FiDollarSign className="text-success" />
              </div>
              <h3 className="text-muted text-xs uppercase font-bold">Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-secondary">₹0</p>
          </div>
          <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <FiPackage className="text-warning" />
              </div>
              <h3 className="text-muted text-xs uppercase font-bold">Orders</h3>
            </div>
            <p className="text-3xl font-bold text-secondary">0</p>
          </div>
          <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiUsers className="text-blue-500" />
              </div>
              <h3 className="text-muted text-xs uppercase font-bold">Customers</h3>
            </div>
            <p className="text-3xl font-bold text-secondary">0</p>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-elevated">
            <h2 className="font-bold text-secondary">Products</h2>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-muted">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading inventory...
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-muted">No products found. Add one to get started.</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-surface-elevated transition-colors">
                  <div className="w-14 h-18 bg-surface-elevated rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={p.image_url} alt={p.title} width={56} height={72} className="w-full h-full object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-secondary truncate">{p.title}</h4>
                    <p className="text-xs text-muted">Stock: {p.stock} • ₹{p.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-muted hover:text-secondary rounded-xl hover:bg-surface-elevated transition-colors">
                      <FiEdit2 />
                    </button>
                    <button className="p-2 text-muted hover:text-error rounded-xl hover:bg-error/10 transition-colors">
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