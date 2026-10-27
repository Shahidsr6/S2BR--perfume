export type ThemeMode = 'dark' | 'light';

export type FragranceFamily = 
  | 'Royal Oud'
  | 'Oriental Spicy'
  | 'Woody Smoky'
  | 'French Floral'
  | 'Sweet Amber'
  | 'Fresh Citrus'
  | 'Leather & Tobacco';

export type ProductGender = 'Men' | 'Women' | 'Unisex';

export interface ProductVariant {
  size: string; // e.g., "50ml", "100ml", "12ml"
  type: string; // e.g., "Spray EdP", "Signature Size", "Non-Alcoholic Attar"
  price: number;
  originalPrice?: number;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: 'Luxury Perfumes' | 'Concentrated Attars' | 'Oud Collection' | 'Discovery Sets';
  gender: ProductGender;
  family: FragranceFamily;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  batchNo: string;
  badge?: string; // "FLAGSHIP LAUNCH", "BESTSELLER", "FEMININE FAVORITE", "PRESTIGE EDITION", "LIMITED EDITION"
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  concentration: string; // e.g., "35% Pure Extrait"
  longevity: string; // "14 - 16 Hours"
  longevityScore: number; // e.g. 9.8
  sillage: string; // "Heavy Enveloping Scent Trail"
  sillageScore: number; // e.g. 9.5
  images: string[];
  notes: FragranceNotes;
  story?: string;
  applicationGuide?: string;
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantSize: string;
  quantity: number;
  priceAtAddition: number;
  product: Product;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'card' | 'raast' | 'wallet';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode?: string;
  specialNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., S2BR-PK-8942
  createdAt: string;
  customerInfo: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  trackingNumber?: string;
  internalNotes?: string;
  hasComplimentaryGift: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: ShippingAddress;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  image: string;
  publishedAt: string;
  category: string;
}

export interface SiteSettings {
  announcementText: string;
  isAnnouncementActive: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtext: string;
  supportPhone: string;
  supportWhatsApp: string;
  supportEmail: string;
}
