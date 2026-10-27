import { createClient } from '@supabase/supabase-js';
import { Order, User, Review } from '../types';

export const SUPABASE_PROJECT_ID = 'jlhusklhgchmkoerrnqj';
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://jlhusklhgchmkoerrnqj.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_r6vIwLWvCMAWi0hZHBSdpw_E7YHAfu5';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// SQL Schema for the user to execute in Supabase SQL editor if tables do not exist yet
export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql)

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  postal_code TEXT,
  special_instructions TEXT,
  payment_method TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  coupon_code TEXT,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  tracking_number TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website_newsletter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  headline TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Insert Policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert to subscribers" ON public.subscribers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert to reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
`;

export const SupabaseService = {
  /**
   * Check connection status to Supabase
   */
  checkConnection: async (): Promise<{ connected: boolean; message: string }> => {
    try {
      const { error } = await supabase.from('customers').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // Even if table doesn't exist yet, we can check basic response
        if (error.message.includes('relation "public.customers" does not exist')) {
          return {
            connected: true,
            message: 'Connected to Supabase! (Tables need to be created in SQL Editor).'
          };
        }
        return {
          connected: true,
          message: `Connected to Supabase (${error.message || 'Ready'}).`
        };
      }
      return { connected: true, message: 'Connected to Supabase account.' };
    } catch (e: any) {
      return { connected: false, message: e?.message || 'Connection failed.' };
    }
  },

  /**
   * Save or update customer details in Supabase
   */
  syncCustomer: async (customer: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    address?: string | { streetAddress: string; city: string; province: string };
    role?: string;
  }): Promise<{ success: boolean; error?: any }> => {
    try {
      const customerId = customer.id || `cust-${Date.now()}`;
      const resolvedAddress = typeof customer.address === 'object'
        ? `${customer.address.streetAddress}, ${customer.address.city}, ${customer.address.province}`
        : (customer.address || '');
      const resolvedCity = typeof customer.address === 'object'
        ? customer.address.city
        : (customer.city || '');

      const payload = {
        id: customerId,
        name: customer.name,
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone || '',
        city: resolvedCity,
        address: resolvedAddress,
        role: customer.role || 'customer',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('customers')
        .upsert(payload, { onConflict: 'email' })
        .select();

      if (error) {
        console.warn('Supabase customer upsert warning:', error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.warn('Supabase customer sync failed:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Save customer order details to Supabase
   */
  syncOrder: async (order: Order): Promise<{ success: boolean; error?: any }> => {
    try {
      // 1. Sync the customer details first
      if (order.customerInfo) {
        await SupabaseService.syncCustomer({
          name: order.customerInfo.fullName,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
          city: order.customerInfo.city,
          address: order.customerInfo.streetAddress
        });
      }

      // 2. Insert order record
      const orderPayload = {
        id: order.id,
        order_number: order.orderNumber,
        customer_name: order.customerInfo.fullName,
        customer_email: order.customerInfo.email,
        customer_phone: order.customerInfo.phone,
        shipping_address: order.customerInfo.streetAddress,
        city: order.customerInfo.city,
        province: order.customerInfo.province || '',
        postal_code: order.customerInfo.postalCode || '',
        special_instructions: order.customerInfo.specialNotes || '',
        payment_method: order.paymentMethod,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        discount: order.discount || 0,
        coupon_code: order.couponCode || null,
        total: order.total,
        status: order.status,
        tracking_number: order.trackingNumber || null,
        items: order.items,
        created_at: order.createdAt
      };

      const { error } = await supabase
        .from('orders')
        .upsert(orderPayload, { onConflict: 'order_number' });

      if (error) {
        console.warn('Supabase order insert warning:', error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.warn('Supabase order sync error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Save subscriber to Supabase
   */
  syncSubscriber: async (email: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const clean = email.trim().toLowerCase();
      const { error } = await supabase
        .from('subscribers')
        .upsert({ email: clean, created_at: new Date().toISOString() }, { onConflict: 'email' });

      if (error) {
        console.warn('Supabase subscriber warning:', error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.warn('Supabase subscriber error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Save contact inquiry to Supabase
   */
  syncContactMessage: async (contact: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: contact.name,
          email: contact.email.trim().toLowerCase(),
          phone: contact.phone || '',
          subject: contact.subject || 'General Inquiry',
          message: contact.message,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Supabase contact message warning:', error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.warn('Supabase contact message error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Save review to Supabase
   */
  syncReview: async (review: Review): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .upsert({
          id: review.id,
          product_id: review.productId,
          user_name: review.authorName,
          rating: review.rating,
          headline: review.title,
          comment: review.comment,
          verified_purchase: review.isVerified,
          created_at: review.date
        }, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase review sync warning:', error.message);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.warn('Supabase review sync error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Push all local customers, orders, and subscribers to Supabase
   */
  syncAllLocalData: async (orders: Order[], user: User | null, subscribers: string[]): Promise<{
    syncedOrders: number;
    syncedCustomers: number;
    syncedSubscribers: number;
  }> => {
    let syncedOrders = 0;
    let syncedCustomers = 0;
    let syncedSubscribers = 0;

    if (user) {
      const res = await SupabaseService.syncCustomer(user);
      if (res.success) syncedCustomers++;
    }

    for (const order of orders) {
      const res = await SupabaseService.syncOrder(order);
      if (res.success) {
        syncedOrders++;
        syncedCustomers++;
      }
    }

    for (const sub of subscribers) {
      const res = await SupabaseService.syncSubscriber(sub);
      if (res.success) syncedSubscribers++;
    }

    return { syncedOrders, syncedCustomers, syncedSubscribers };
  }
};
