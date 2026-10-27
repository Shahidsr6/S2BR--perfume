import { 
  Product, 
  Order, 
  CartItem, 
  WishlistItem, 
  Review, 
  Coupon, 
  BlogPost, 
  SiteSettings, 
  User, 
  OrderStatus,
  ThemeMode
} from '../types';
import { 
  initialProducts, 
  initialReviews, 
  initialCoupons, 
  initialBlogPosts, 
  initialSiteSettings, 
  initialAdminUser,
  initialCustomerUser 
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 's2br_products_v1',
  ORDERS: 's2br_orders_v1',
  CART: 's2br_cart_v1',
  WISHLIST: 's2br_wishlist_v1',
  REVIEWS: 's2br_reviews_v1',
  COUPONS: 's2br_coupons_v1',
  BLOG: 's2br_blog_v1',
  SETTINGS: 's2br_settings_v1',
  USER: 's2br_current_user_v1',
  SUBSCRIBERS: 's2br_subscribers_v1',
  THEME: 's2br_theme_v1'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// Initial orders seed data
const initialOrdersSeed: Order[] = [
  {
    id: "ord-8840",
    orderNumber: "S2BR-PK-8840",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    customerInfo: {
      fullName: "Shahmeer Zaman",
      phone: "+92 321 4455667",
      email: "shahmeer@zaman.pk",
      streetAddress: "House 18, Street 4, Sector Y, DHA Phase 6",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54792",
      specialNotes: "Leave at security gate if unavailable"
    },
    items: [
      {
        productId: "s2br-imperial-noir",
        productName: "S2BR Imperial Noir Extrait",
        size: "100ml",
        quantity: 1,
        unitPrice: 5850,
        totalPrice: 5850,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNWoooSFkfDBTcaGiiRbANR001zvrQRDBAyAtmj7S4EgQAkM-Yj-WLeTkj_HcN1ux3ZmZdnjOkFWFPDcvDy_z3IK2ImmeHhu281bJt17P2DIQinYRZ0dDufQ2yA1v5OVRreYG-JDzYMGmsEjUqrofFkevzmNeL07SlmjIIEOHKXHSjupZ14rhv2kE1iqgMh8OsPJkVyFeHZN7W41VoZ0Td1zVVWfwU5zEMTcalZl_AF-Xf17GSKWzkrQ"
      }
    ],
    subtotal: 5850,
    shippingFee: 0,
    discount: 500,
    couponCode: "S2BRVIP",
    total: 5350,
    paymentMethod: "cod",
    status: "Delivered",
    statusHistory: [
      { status: "Pending", timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: "Order placed via website" },
      { status: "Confirmed", timestamp: new Date(Date.now() - 1.8 * 86400000).toISOString(), note: "WhatsApp confirmed by customer" },
      { status: "Shipped", timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: "Dispatched via TCS Air Express #TCS-9018442" },
      { status: "Delivered", timestamp: new Date(Date.now() - 0.2 * 86400000).toISOString(), note: "Received and verified by customer" }
    ],
    trackingNumber: "TCS-9018442",
    hasComplimentaryGift: true
  }
];

export const StorageService = {
  // Products
  getProducts: (): Product[] => safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts),
  
  getProductById: (id: string): Product | undefined => {
    const list = StorageService.getProducts();
    return list.find(p => p.id === id);
  },

  saveProduct: (product: Product): void => {
    const list = StorageService.getProducts();
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    safeSet(STORAGE_KEYS.PRODUCTS, list);
  },

  deleteProduct: (id: string): void => {
    const list = StorageService.getProducts().filter(p => p.id !== id);
    safeSet(STORAGE_KEYS.PRODUCTS, list);
  },

  adjustInventory: (productId: string, quantityToDeduct: number): boolean => {
    const list = StorageService.getProducts();
    const idx = list.findIndex(p => p.id === productId);
    if (idx >= 0) {
      const newStock = Math.max(0, list[idx].stock - quantityToDeduct);
      list[idx].stock = newStock;
      safeSet(STORAGE_KEYS.PRODUCTS, list);
      return true;
    }
    return false;
  },

  // Orders
  getOrders: (): Order[] => safeGet<Order[]>(STORAGE_KEYS.ORDERS, initialOrdersSeed),

  getOrderByIdOrNumber: (query: string): Order | undefined => {
    const clean = query.trim().toUpperCase();
    const list = StorageService.getOrders();
    return list.find(o => 
      o.id.toUpperCase() === clean || 
      o.orderNumber.toUpperCase() === clean ||
      o.customerInfo.phone.includes(query.trim())
    );
  },

  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>): Order => {
    const orders = StorageService.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${randomSuffix}`,
      orderNumber: `S2BR-PK-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order registered in S2BR Fragrance Atelier' }
      ]
    };

    // Deduct inventory
    orderData.items.forEach(item => {
      StorageService.adjustInventory(item.productId, item.quantity);
    });

    orders.unshift(newOrder);
    safeSet(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string): Order | undefined => {
    const list = StorageService.getOrders();
    const idx = list.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      list[idx].status = newStatus;
      list[idx].statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`
      });
      safeSet(STORAGE_KEYS.ORDERS, list);
      return list[idx];
    }
    return undefined;
  },

  // Cart
  getCart: (): CartItem[] => safeGet<CartItem[]>(STORAGE_KEYS.CART, [
    {
      productId: "s2br-imperial-noir",
      variantSize: "100ml",
      quantity: 1,
      priceAtAddition: 5850,
      product: initialProducts[0]
    },
    {
      productId: "oud-al-sultani",
      variantSize: "12ml",
      quantity: 1,
      priceAtAddition: 4850,
      product: initialProducts[1]
    }
  ]),

  saveCart: (cart: CartItem[]): void => safeSet(STORAGE_KEYS.CART, cart),

  clearCart: (): void => safeSet(STORAGE_KEYS.CART, []),

  // Wishlist
  getWishlist: (): string[] => safeGet<string[]>(STORAGE_KEYS.WISHLIST, ["s2br-imperial-noir", "celestial-musk-elixir"]),

  toggleWishlist: (productId: string): string[] => {
    const list = StorageService.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
    safeSet(STORAGE_KEYS.WISHLIST, updated);
    return updated;
  },

  // Reviews
  getReviews: (): Review[] => safeGet<Review[]>(STORAGE_KEYS.REVIEWS, initialReviews),

  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>): Review => {
    const list = StorageService.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: "Just now",
      status: "approved" // automatically approve for smooth demo experience
    };
    list.unshift(newRev);
    safeSet(STORAGE_KEYS.REVIEWS, list);
    return newRev;
  },

  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected'): void => {
    const list = StorageService.getReviews();
    const idx = list.findIndex(r => r.id === reviewId);
    if (idx >= 0) {
      list[idx].status = status;
      safeSet(STORAGE_KEYS.REVIEWS, list);
    }
  },

  deleteReview: (reviewId: string): void => {
    const list = StorageService.getReviews().filter(r => r.id !== reviewId);
    safeSet(STORAGE_KEYS.REVIEWS, list);
  },

  // Coupons
  getCoupons: (): Coupon[] => safeGet<Coupon[]>(STORAGE_KEYS.COUPONS, initialCoupons),

  validateCoupon: (code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string; discountAmount: number } => {
    const list = StorageService.getCoupons();
    const found = list.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { valid: false, error: "Invalid or expired promotional code.", discountAmount: 0 };
    }
    if (subtotal < found.minOrderAmount) {
      return { valid: false, error: `Minimum order amount of Rs. ${found.minOrderAmount.toLocaleString()} required for this code.`, discountAmount: 0 };
    }
    let discount = 0;
    if (found.discountType === 'fixed') {
      discount = found.discountValue;
    } else {
      discount = Math.round((subtotal * found.discountValue) / 100);
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    }
    return { valid: true, coupon: found, discountAmount: discount };
  },

  saveCoupon: (coupon: Coupon): void => {
    const list = StorageService.getCoupons();
    const idx = list.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      list[idx] = coupon;
    } else {
      list.unshift(coupon);
    }
    safeSet(STORAGE_KEYS.COUPONS, list);
  },

  deleteCoupon: (id: string): void => {
    const list = StorageService.getCoupons().filter(c => c.id !== id);
    safeSet(STORAGE_KEYS.COUPONS, list);
  },

  // Blog
  getBlogPosts: (): BlogPost[] => safeGet<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts),

  // Settings
  getSettings: (): SiteSettings => safeGet<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings),

  saveSettings: (settings: SiteSettings): void => safeSet(STORAGE_KEYS.SETTINGS, settings),

  // Current User
  getCurrentUser: (): User | null => safeGet<User | null>(STORAGE_KEYS.USER, initialCustomerUser),

  setCurrentUser: (user: User | null): void => safeSet(STORAGE_KEYS.USER, user),

  // Newsletter
  getSubscribers: (): string[] => safeGet<string[]>(STORAGE_KEYS.SUBSCRIBERS, ["shahid@pakistan.com", "daniyal.shah@gmail.com"]),

  addSubscriber: (email: string): boolean => {
    const list = StorageService.getSubscribers();
    const clean = email.trim().toLowerCase();
    if (!list.includes(clean)) {
      list.unshift(clean);
      safeSet(STORAGE_KEYS.SUBSCRIBERS, list);
      return true;
    }
    return false;
  },

  // Theme Mode (Dark / Light)
  getTheme: (): ThemeMode => safeGet<ThemeMode>(STORAGE_KEYS.THEME, 'dark'),

  setTheme: (theme: ThemeMode): void => safeSet(STORAGE_KEYS.THEME, theme)
};
