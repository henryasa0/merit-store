export interface Product {
  id: string;
  name: string;
  category: string;
  categories?: string[];
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number; // e.g. 15 for 15% off
  description: string;
  features: string[];
  image: string;
  rating: number;
  stock: number;
  isFeatured?: boolean;
  packages?: { bottles: number; price: number; label: string; oldPrice?: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Cancelled' | 'Delivered';
  paymentMethod: 'Pay On Delivery' | 'Paystack';
}

export interface StoreNotificationConfig {
  storeEmail: string;
  storeWhatsApp: string;
  storeSMS: string;
  enableEmail: boolean;
  enableWhatsApp: boolean;
  enableSMS: boolean;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: 'Email' | 'WhatsApp' | 'SMS';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Failed';
}

