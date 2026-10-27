import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, SiteSettings, Order, ThemeMode } from '../types';
import { StorageService } from '../services/storage';

interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Theme Mode
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Navigation
  currentPage: string;
  selectedProductId: string | null;
  selectedBlogPostSlug: string | null;
  lastCreatedOrderId: string | null;
  navigateTo: (page: string, params?: { productId?: string; blogSlug?: string; orderId?: string }) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Quick View & Search Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => StorageService.getTheme());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('s2br-imperial-noir');
  const [selectedBlogPostSlug, setSelectedBlogPostSlug] = useState<string | null>(null);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StorageService.getWishlist());
  const [user, setUserState] = useState<User | null>(() => StorageService.getCurrentUser());
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() => StorageService.getSettings());

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Keep theme synchronized with document element and storage
  useEffect(() => {
    StorageService.setTheme(theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    showToast(
      nextTheme === 'light' 
        ? 'Switched to Daylight Atelier Mode' 
        : 'Switched to Noir Evening Mode',
      'info'
    );
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  // Keep localStorage synchronized
  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: string, params?: { productId?: string; blogSlug?: string; orderId?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.blogSlug) {
      setSelectedBlogPostSlug(params.blogSlug);
    }
    if (params?.orderId) {
      setLastCreatedOrderId(params.orderId);
    }
    setCurrentPage(page);
  };

  const addToCart = (product: Product, size: string, quantity = 1) => {
    const variant = product.variants.find((v) => v.size === size) || product.variants[0];
    const unitPrice = variant ? variant.price : product.price;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.variantSize === size
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantSize: size,
            quantity,
            priceAtAddition: unitPrice,
            product
          }
        ];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${size}) to your Fragrance Vault.`);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantSize === size)));
    showToast("Flacon removed from your Fragrance Vault.", "info");
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    StorageService.clearCart();
  };

  const toggleWishlist = (productId: string) => {
    const updated = StorageService.toggleWishlist(productId);
    setWishlist(updated);
    const inList = updated.includes(productId);
    const prod = StorageService.getProductById(productId);
    const name = prod ? prod.name : "Item";
    showToast(inList ? `Added ${name} to Wishlist` : `Removed ${name} from Wishlist`);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    StorageService.setCurrentUser(newUser);
  };

  const logout = () => {
    setUser(null);
    showToast("Signed out of S2BR Atelier.");
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettingsState(settings);
    StorageService.saveSettings(settings);
    showToast("Atelier site settings updated successfully.");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        currentPage,
        selectedProductId,
        selectedBlogPostSlug,
        lastCreatedOrderId,
        navigateTo,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        setUser,
        logout,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        siteSettings,
        updateSiteSettings,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
