export type Category = 'hats' | 'watches' | 'hoodies' | 'pants' | 'jackets';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  subtotal: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
}

export interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
}
