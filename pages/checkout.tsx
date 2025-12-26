import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const { cartItems, cartCount } = useCart();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
       toast('Please login to checkout');
       // In a real app, maybe redirect to login page or show modal
    }
  }, [authLoading, user]);

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handlePayment = async () => {
    if (!user) {
        signInWithGoogle();
        return;
    }
    if (!address.line1 || !address.pincode) {
        toast.error('Please fill in your address');
        return;
    }

    setProcessing(true);
    const toastId = toast.loading('Initiating secure payment...');

    try {
      // 1. Create Order on Server
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, address })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add this to env!
        amount: data.amount,
        currency: data.currency,
        name: 'DesiThreads',
        description: 'Order Payment',
        order_id: data.id,
        handler: async function (response: any) {
           // 3. Verify on Server
           toast.loading('Verifying payment...', { id: toastId });
           
           const verifyRes = await fetch('/api/payment/verify', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               userId: user.id
             })
           });

           const verifyData = await verifyRes.json();
           if (verifyRes.ok) {
             toast.success('Payment Successful!', { id: toastId });
             router.push('/success');
           } else {
             toast.error('Verification failed: ' + verifyData.message, { id: toastId });
           }
        },
        prefill: {
            name: user.user_metadata.full_name,
            email: user.email,
            contact: address.phone
        },
        theme: {
            color: '#ff3f6c'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast.error(err.message || 'Payment failed', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading) return <Layout><div className="p-10 text-center">Loading...</div></Layout>;

  return (
    <Layout title="Checkout">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary mb-6">Secure Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Address Form */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase text-muted">Shipping Address</h3>
            <input 
                placeholder="Full Address (House No, Street)" 
                className="w-full border border-border p-3 rounded"
                value={address.line1}
                onChange={e => setAddress({...address, line1: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    placeholder="City" 
                    className="w-full border border-border p-3 rounded"
                    value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                />
                <input 
                    placeholder="Pincode" 
                    className="w-full border border-border p-3 rounded"
                    value={address.pincode}
                    onChange={e => setAddress({...address, pincode: e.target.value})}
                />
            </div>
            <input 
                placeholder="Phone Number" 
                className="w-full border border-border p-3 rounded"
                value={address.phone}
                onChange={e => setAddress({...address, phone: e.target.value})}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
             <h3 className="font-bold text-sm uppercase text-muted mb-4">Order Summary</h3>
             <div className="space-y-2 mb-4 text-sm">
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.product?.title} x {item.quantity}</span>
                        <span>₹{(item.product?.price || 0) * item.quantity}</span>
                    </div>
                ))}
             </div>
             <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalAmount}</span>
             </div>

             <button 
                onClick={handlePayment}
                disabled={processing || cartCount === 0}
                className="w-full bg-primary text-white font-bold py-3 rounded mt-6 disabled:opacity-50"
             >
                {processing ? 'Processing...' : user ? 'Pay Now' : 'Login to Pay'}
             </button>
             
             <p className="text-[10px] text-center mt-3 text-muted flex items-center justify-center gap-1">
                🔒 Secured by Razorpay • 256-bit Encryption
             </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
