import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
        // Fetch items and join with products
        // Note: Supabase join syntax requires correct foreign key setup
        const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user.id);

        if (error) throw error;
        
        // Transform to match CartItem type if needed (Supabase returns nested objects)
        setCartItems(data as CartItem[]);
    } catch (err) {
        console.error('Error fetching cart:', err);
    } finally {
        setLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string) => {
    if (!user) {
      toast.error('Please login to add items');
      // TODO: Implement local storage fallback
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          size: size,
          quantity: 1 // For now simple qty
        }, { onConflict: 'user_id,product_id,size' });

      if (error) throw error;
      toast.success('Added to Bag');
      refreshCart();
    } catch (err: any) {
      toast.error('Failed to add: ' + err.message);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, refreshCart, cartCount: cartItems.length }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);