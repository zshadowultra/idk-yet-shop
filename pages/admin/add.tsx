import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category_id: '1', // Defaulting to Men for now
    stock: '10',
    sizes: 'S,M,L'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { error } = await supabase.from('products').insert([
        {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            image_url: formData.image_url,
            category_id: formData.category_id,
            stock: parseInt(formData.stock),
            sizes: formData.sizes.split(',').map(s => s.trim().toUpperCase())
        }
        ]);

        if (error) throw error;
        
        toast.success('Product added successfully!');
        setTimeout(() => router.push('/admin'), 1500);

    } catch (err: any) {
        // If we fail (likely DB connection), warn the user
        console.warn('Add Product Error:', err);
        toast('Demo Mode: DB not connected. Product not saved.', { 
            icon: '⚠️',
            style: { border: '1px solid orange', color: 'orange' } 
        });
        
        // Optionally redirect anyway to simulate flow
        setTimeout(() => router.push('/admin'), 2000);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Layout title="Add Product">
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Title</label>
            <input 
              required
              name="title"
              type="text" 
              className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. Blue Denim Jacket"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Description</label>
            <textarea 
              name="description"
              rows={3}
              className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="Product details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">Price (₹)</label>
              <input 
                required
                name="price"
                type="number" 
                className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">Original Price (₹)</label>
              <input 
                name="original_price"
                type="number" 
                className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
                placeholder="Optional"
                value={formData.original_price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Image URL</label>
            <input 
              required
              name="image_url"
              type="url" 
              className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="https://..."
              value={formData.image_url}
              onChange={handleChange}
            />
            <p className="text-[10px] text-muted mt-1">Paste a URL for now (e.g. from Unsplash or Imgur) or configure Storage upload.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Sizes (comma separated)</label>
            <input 
              name="sizes"
              type="text" 
              className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="S, M, L, XL"
              value={formData.sizes}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-md shadow-lg shadow-primary/30 uppercase tracking-wide text-sm disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </Layout>
  );
}