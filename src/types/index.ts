export type Category =
  | 'Electronics'
  | 'Fashion'
  | 'Beauty'
  | 'Home & Kitchen'
  | 'Books'
  | 'Sports'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  variants?: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: number;
}

export interface User {
  name: string;
  email: string;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  deliveryCharge: number;
  address: Address;
  paymentMethod: string;
  status: OrderStatus;
  date: number;
}
