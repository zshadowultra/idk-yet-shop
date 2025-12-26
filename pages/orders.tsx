import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderItem } from '@/types';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <Layout><div className="p-10 text-center">Please login to view orders</div></Layout>;

  return (
    <Layout title="My Orders">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">Order History</h1>

        {loading ? (
           <div className="animate-pulse space-y-4">
              {[1,2].map(i => <div key={i} className="h-40 bg-gray-100 rounded"></div>)}
           </div>
        ) : orders.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded">
              <p className="text-muted">No orders found yet.</p>
           </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b border-border flex justify-between items-center">
                   <div>
                       <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                           order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                       }`}>
                           {order.status.replace('_', ' ')}
                       </span>
                       <p className="text-xs text-muted mt-1">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                       <span className="font-bold text-secondary">₹{order.total_amount}</span>
                   </div>
                </div>
                
                <div className="p-4 space-y-4">
                   {order.items?.map((item) => (
                       <div key={item.id} className="flex gap-4">
                           <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                               <img src={item.image_url} className="w-full h-full object-cover" />
                           </div>
                           <div>
                               <h4 className="font-medium text-sm text-secondary">{item.product_title}</h4>
                               <p className="text-xs text-muted">Size: {item.size} • Qty: {item.quantity}</p>
                           </div>
                       </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
