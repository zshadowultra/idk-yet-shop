export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  category_id: string;
  image_url: string;
  sizes: string[];
  stock: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product; // For joining data
  quantity: number;
  size: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  phone?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Order {
  id: string;
  razorpay_order_id: string;
  status: 'pending_payment' | 'paid' | 'failed' | 'shipped' | 'delivered';
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_title: string;
  price_at_purchase: number;
  quantity: number;
  size: string;
  image_url: string;
}