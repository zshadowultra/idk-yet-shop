import type { NextApiRequest, NextApiResponse } from 'next';
import { razorpay } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';
import shortid from 'shortid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { userId } = req.body; // In a real app, extract this from the Auth Token for security!
    
    // SECURITY NOTE: We are trusting the userId from body for this MVP/Prototype. 
    // In production, you MUST verify the 'Authorization' header token using supabase.auth.getUser(token).
    // Example: const { data: { user } } = await supabase.auth.getUser(req.headers.authorization);

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // 1. Fetch Cart Items from DB (Single Source of Truth)
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Calculate Total Amount Server-Side
    let totalAmount = 0;
    cartItems.forEach((item: any) => {
      if (item.product) {
        totalAmount += item.product.price * item.quantity;
      }
    });

    if (totalAmount === 0) return res.status(400).json({ message: 'Invalid total' });

    // 3. Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: shortid.generate(),
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // 4. Create "Pending" Order in DB
    // We create the order record NOW so we can link the payment to it later.
    const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            razorpay_order_id: order.id,
            status: 'pending_payment',
            total_amount: totalAmount,
            shipping_address: req.body.address || {} // Store address passed from checkout
        })
        .select()
        .single();
    
    if (orderError) throw orderError;

    // 5. Snapshot items into order_items (Optional but recommended to do now or after verification)
    // For atomic consistency, we often do this after payment, but doing it now locks the price.
    // Let's do it now.
    const orderItemsData = cartItems.map((item: any) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_title: item.product.title,
        price_at_purchase: item.product.price,
        quantity: item.quantity,
        size: item.size,
        image_url: item.product.image_url
    }));

    await supabase.from('order_items').insert(orderItemsData);

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      db_order_id: newOrder.id
    });

  } catch (error: any) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: error.message });
  }
}