import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Product, Order, OrderStatus, Coupon, Review, FragranceFamily } from '../../types';
import { 
  SupabaseService, 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_SQL_SCHEMA 
} from '../../services/supabase';

export const AdminDashboard: React.FC = () => {
  const { user, setUser, navigateTo, siteSettings, updateSiteSettings, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'reviews' | 'settings' | 'database'>('overview');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Trigger state for re-rendering after storage updates
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const products = useMemo(() => StorageService.getProducts(), [version]);
  const orders = useMemo(() => StorageService.getOrders(), [version]);
  const coupons = useMemo(() => StorageService.getCoupons(), [version]);
  const reviews = useMemo(() => StorageService.getReviews(), [version]);

  // Analytics
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'Pending').length, [orders]);
  const lowStockCount = useMemo(() => products.filter((p) => p.stock < 25).length, [products]);

  // Product Edit / Create Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Form State for Product
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    subtitle: 'Extrait de Parfum • 100 ML',
    description: '',
    category: 'Luxury Perfumes',
    gender: 'Men',
    family: 'Woody Smoky',
    price: 5500,
    originalPrice: 6500,
    stock: 30,
    sku: 'S2BR-NEW-01',
    batchNo: '#S2-PK26',
    badge: 'NEW ARRIVAL',
    concentration: '35% Pure Extrait',
    longevity: '14 - 16 Hours',
    sillage: 'Heavy Enveloping Trail',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDNWoooSFkfDBTcaGiiRbANR001zvrQRDBAyAtmj7S4EgQAkM-Yj-WLeTkj_HcN1ux3ZmZdnjOkFWFPDcvDy_z3IK2ImmeHhu281bJt17P2DIQinYRZ0dDufQ2yA1v5OVRreYG-JDzYMGmsEjUqrofFkevzmNeL07SlmjIIEOHKXHSjupZ14rhv2kE1iqgMh8OsPJkVyFeHZN7W41VoZ0Td1zVVWfwU5zEMTcalZl_AF-Xf17GSKWzkrQ'],
    notes: {
      top: ['Cardamom', 'Bergamot'],
      heart: ['Oud', 'Rose'],
      base: ['Amber', 'Leather']
    },
    variants: [
      { size: '50ml', type: 'Spray Flacon', price: 4200 },
      { size: '100ml', type: 'Signature Flacon', price: 5500 }
    ]
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  // Coupon Create Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(500);

  // Order Detail Drawer
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // If not admin, offer admin unlock
  if (user?.role !== 'admin') {
    return (
      <div className="w-full bg-[#141312] text-[#e6e1df] py-20 flex items-center justify-center">
        <div className="bg-[#1d1b1a] p-8 border border-[#f2ca50]/40 max-w-md w-full text-center space-y-4 shadow-2xl">
          <span className="material-symbols-outlined text-[48px] text-[#f2ca50]">admin_panel_settings</span>
          <h2 className="font-headline-sm text-2xl font-serif">S2BR Atelier Admin Access</h2>
          <p className="font-body-sm text-[13px] text-[#d0c5af]">
            Authenticate with Atelier master credentials to manage products, view sales analytics, and update nationwide dispatches.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setUser({
                  id: 'admin-s2br',
                  name: 'Atelier Master Administrator',
                  email: 'admin@s2br.pk',
                  phone: '+92 300 0077227',
                  role: 'admin',
                  createdAt: new Date().toISOString()
                });
                showToast('Authorized as S2BR Administrator.');
              }}
              className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffe088]"
            >
              UNLOCK ADMIN PORTAL (1-CLICK)
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2 text-[#99907c] hover:text-[#e6e1df] font-title-sc text-[11px] uppercase tracking-wider"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) {
      showToast('Name and price are required.', 'error');
      return;
    }

    const targetId = editingProduct ? editingProduct.id : `s2br-${Date.now()}`;
    const productData: Product = {
      id: targetId,
      name: prodForm.name || 'New Fragrance',
      subtitle: prodForm.subtitle || 'Extrait de Parfum • 100 ML',
      description: prodForm.description || '',
      category: prodForm.category as any || 'Luxury Perfumes',
      gender: prodForm.gender as any || 'Men',
      family: prodForm.family as any || 'Woody Smoky',
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 1,
      stock: Number(prodForm.stock) || 20,
      sku: prodForm.sku || `S2BR-${Date.now()}`,
      batchNo: prodForm.batchNo || '#S2-PK26',
      badge: prodForm.badge,
      concentration: prodForm.concentration || '35% Pure Extrait',
      longevity: prodForm.longevity || '14 - 16 Hours',
      longevityScore: 9.6,
      sillage: prodForm.sillage || 'Heavy Enveloping Trail',
      sillageScore: 9.4,
      images: prodForm.images?.length ? prodForm.images : ['https://lh3.googleusercontent.com/aida-public/AB6AXuDNWoooSFkfDBTcaGiiRbANR001zvrQRDBAyAtmj7S4EgQAkM-Yj-WLeTkj_HcN1ux3ZmZdnjOkFWFPDcvDy_z3IK2ImmeHhu281bJt17P2DIQinYRZ0dDufQ2yA1v5OVRreYG-JDzYMGmsEjUqrofFkevzmNeL07SlmjIIEOHKXHSjupZ14rhv2kE1iqgMh8OsPJkVyFeHZN7W41VoZ0Td1zVVWfwU5zEMTcalZl_AF-Xf17GSKWzkrQ'],
      notes: prodForm.notes || { top: ['Bergamot'], heart: ['Oud'], base: ['Amber'] },
      variants: prodForm.variants?.length ? prodForm.variants : [{ size: '100ml', type: 'Signature Flacon', price: Number(prodForm.price) }],
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    StorageService.saveProduct(productData);
    setEditingProduct(null);
    setIsCreatingProduct(false);
    refresh();
    showToast(`Masterpiece '${productData.name}' saved to vault.`);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to retire this fragrance formulation?')) {
      StorageService.deleteProduct(id);
      refresh();
      showToast('Product removed from catalogue.', 'info');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    StorageService.updateOrderStatus(orderId, status);
    refresh();
    showToast(`Order status updated to ${status}.`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const coup: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: 'fixed',
      discountValue: Number(newCouponDiscount),
      minOrderAmount: 3000,
      expiryDate: '2026-12-31',
      isActive: true,
      usageCount: 0
    };
    StorageService.saveCoupon(coup);
    setNewCouponCode('');
    refresh();
    showToast(`Promotional voucher ${coup.code} created.`);
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    StorageService.saveCoupon({ ...coupon, isActive: !coupon.isActive });
    refresh();
    showToast(`Voucher ${coupon.code} ${coupon.isActive ? 'deactivated' : 'activated'}.`);
  };

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Bar Header */}
        <div className="bg-[#1d1b1a] p-6 border border-[#f2ca50]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2ca50] text-[32px]">admin_panel_settings</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-2xl font-serif text-[#e6e1df]">
                  S2BR Atelier Management Console
                </h1>
                <span className="bg-[#745b00] text-[#f8d575] font-label-caps text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                  Live DB
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#99907c]">
                Storefront Inventory, Orders Fulfillment, Customer Records & Promotional Vouchers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="px-4 py-2 bg-[#2b2a28] hover:bg-[#363433] text-[#e5c365] text-[11px] font-title-sc uppercase tracking-wider border border-[#f2ca50]/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View Live Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#4d4635]/40 overflow-x-auto gap-2">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: 'dashboard' },
            { id: 'products', label: `Products (${products.length})`, icon: 'inventory' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'receipt_long' },
            { id: 'inventory', label: `Stock Levels (${lowStockCount} Low)`, icon: 'warehouse' },
            { id: 'coupons', label: `Vouchers (${coupons.length})`, icon: 'sell' },
            { id: 'reviews', label: `Moderation (${reviews.length})`, icon: 'rate_review' },
            { id: 'settings', label: 'Homepage Settings', icon: 'tune' },
            { id: 'database', label: 'Supabase DB Sync', icon: 'database' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-title-sc text-[11px] uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#f2ca50] text-[#f2ca50] font-bold bg-[#1d1b1a]'
                  : 'border-transparent text-[#99907c] hover:text-[#e6e1df]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 shadow-md space-y-1">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Total Realized Revenue</span>
                <div className="font-headline-sm text-2xl text-[#f2ca50] font-bold">
                  Rs. {totalSales.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#e5c365] block font-body-sm">From {orders.length} Pakistan consignments</span>
              </div>

              <div className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 shadow-md space-y-1">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Pending Dispatch</span>
                <div className="font-headline-sm text-2xl text-[#e6e1df] font-bold">
                  {pendingOrders} Orders
                </div>
                <span className="text-[11px] text-[#99907c] block font-body-sm">Awaiting warehouse packaging</span>
              </div>

              <div className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 shadow-md space-y-1">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Active Formulations</span>
                <div className="font-headline-sm text-2xl text-[#e6e1df] font-bold">
                  {products.length} Flacons
                </div>
                <span className="text-[11px] text-[#99907c] block font-body-sm">Across 4 luxury categories</span>
              </div>

              <div className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 shadow-md space-y-1">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Inventory Health</span>
                <div className="font-headline-sm text-2xl text-amber-400 font-bold">
                  {lowStockCount} Low Flacons
                </div>
                <span className="text-[11px] text-[#99907c] block font-body-sm">Stock below 25 reserve units</span>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#4d4635]/30">
                <h3 className="font-headline-sm text-lg text-[#e6e1df] font-serif">Recent Nationwide Consignments</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[11px] text-[#f2ca50] hover:underline font-title-sc uppercase">
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] font-body-sm">
                  <thead className="text-[#99907c] uppercase font-label-caps text-[10px] border-b border-[#4d4635]/25">
                    <tr>
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Patron</th>
                      <th className="py-2.5">City</th>
                      <th className="py-2.5">Items</th>
                      <th className="py-2.5">Total</th>
                      <th className="py-2.5">Payment</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4d4635]/20">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#211f1e] transition-colors">
                        <td className="py-3 font-mono font-semibold text-[#f2ca50]">{ord.orderNumber}</td>
                        <td className="py-3 text-[#e6e1df]">{ord.customerInfo.fullName}</td>
                        <td className="py-3 text-[#d0c5af]">{ord.customerInfo.city}</td>
                        <td className="py-3 text-[#99907c]">{ord.items.length} item(s)</td>
                        <td className="py-3 font-semibold text-[#e6e1df]">Rs. {ord.total.toLocaleString()}</td>
                        <td className="py-3 uppercase text-[11px]">{ord.paymentMethod}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/30">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Products Management & CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Product Catalogue Management</h3>
                <p className="font-body-sm text-[12px] text-[#99907c]">Create, edit pricing, update descriptions, and manage stock</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdForm({
                    name: '',
                    subtitle: 'Extrait de Parfum • 100 ML',
                    description: '',
                    category: 'Luxury Perfumes',
                    gender: 'Men',
                    family: 'Woody Smoky',
                    price: 5500,
                    originalPrice: 6500,
                    stock: 35,
                    sku: `S2BR-${Date.now().toString().slice(-4)}`,
                    batchNo: '#S2-PK26',
                    badge: 'NEW ARRIVAL',
                    concentration: '35% Pure Extrait',
                    longevity: '14 - 16 Hours',
                    sillage: 'Heavy Enveloping Trail',
                    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDNWoooSFkfDBTcaGiiRbANR001zvrQRDBAyAtmj7S4EgQAkM-Yj-WLeTkj_HcN1ux3ZmZdnjOkFWFPDcvDy_z3IK2ImmeHhu281bJt17P2DIQinYRZ0dDufQ2yA1v5OVRreYG-JDzYMGmsEjUqrofFkevzmNeL07SlmjIIEOHKXHSjupZ14rhv2kE1iqgMh8OsPJkVyFeHZN7W41VoZ0Td1zVVWfwU5zEMTcalZl_AF-Xf17GSKWzkrQ'],
                    notes: { top: ['Bergamot', 'Cardamom'], heart: ['Oud', 'Rose'], base: ['Amber', 'Leather'] },
                    variants: [{ size: '100ml', type: 'Signature Flacon', price: 5500 }]
                  });
                  setIsCreatingProduct(true);
                }}
                className="px-4 py-2.5 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                ADD NEW FLACON
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#1d1b1a] border border-[#4d4635]/30 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-[12px] font-body-sm">
                <thead className="bg-[#0f0e0d] text-[#99907c] uppercase font-label-caps text-[10px] border-b border-[#4d4635]/30">
                  <tr>
                    <th className="p-3">Flacon</th>
                    <th className="p-3">Name & Family</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Price (PKR)</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Badge</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4d4635]/20">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#211f1e] transition-colors">
                      <td className="p-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover bg-[#0f0e0d] border border-[#4d4635]/30" />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#e6e1df]">{p.name}</div>
                        <div className="text-[11px] text-[#f2ca50]">{p.family}</div>
                      </td>
                      <td className="p-3 text-[#d0c5af]">{p.category}</td>
                      <td className="p-3 text-[#99907c]">{p.gender}</td>
                      <td className="p-3 font-bold text-[#e6e1df]">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[11px] font-bold ${p.stock < 25 ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3">
                        {p.badge && (
                          <span className="px-2 py-0.5 text-[9px] font-label-caps uppercase bg-[#f2ca50]/20 text-[#f2ca50]">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdForm(p);
                            setIsCreatingProduct(true);
                          }}
                          className="px-2.5 py-1 bg-[#2b2a28] hover:bg-[#363433] text-[#f2ca50] text-[11px] uppercase border border-[#f2ca50]/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px] uppercase border border-red-500/30"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Edit / Create Modal */}
            {isCreatingProduct && (
              <div 
                className="fixed inset-0 z-50 bg-[#0f0e0d]/85 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setIsCreatingProduct(false)}
              >
                <div 
                  className="bg-[#1d1b1a] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#f2ca50]/30 shadow-2xl space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#4d4635]/30">
                    <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">
                      {editingProduct ? 'Edit Fragrance Formulation' : 'Create New Fragrance'}
                    </h3>
                    <button onClick={() => setIsCreatingProduct(false)} className="text-[#99907c] hover:text-[#f2ca50]">
                      <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-[13px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          value={prodForm.name}
                          onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Subtitle / Concentration</label>
                        <input
                          type="text"
                          value={prodForm.subtitle}
                          onChange={(e) => setProdForm({ ...prodForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Price (PKR)</label>
                        <input
                          type="number"
                          required
                          value={prodForm.price}
                          onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Original Price (PKR)</label>
                        <input
                          type="number"
                          value={prodForm.originalPrice || ''}
                          onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          required
                          value={prodForm.stock}
                          onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Category</label>
                        <select
                          value={prodForm.category}
                          onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        >
                          <option value="Luxury Perfumes">Luxury Perfumes</option>
                          <option value="Concentrated Attars">Concentrated Attars</option>
                          <option value="Oud Collection">Oud Collection</option>
                          <option value="Discovery Sets">Discovery Sets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Gender</label>
                        <select
                          value={prodForm.gender}
                          onChange={(e) => setProdForm({ ...prodForm, gender: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        >
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Olfactory Family</label>
                        <select
                          value={prodForm.family}
                          onChange={(e) => setProdForm({ ...prodForm, family: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        >
                          <option value="Royal Oud">Royal Oud</option>
                          <option value="Oriental Spicy">Oriental Spicy</option>
                          <option value="Woody Smoky">Woody Smoky</option>
                          <option value="French Floral">French Floral</option>
                          <option value="Sweet Amber">Sweet Amber</option>
                          <option value="Leather & Tobacco">Leather & Tobacco</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={prodForm.description}
                        onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={prodForm.badge || ''}
                          onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                          placeholder="e.g. BESTSELLER, LIMITED EDITION"
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Image URL</label>
                        <input
                          type="text"
                          value={prodForm.images?.[0] || ''}
                          onChange={(e) => setProdForm({ ...prodForm, images: [e.target.value] })}
                          className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCreatingProduct(false)}
                        className="px-5 py-2.5 bg-[#2b2a28] text-[#99907c] font-title-sc text-[11px] uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-bold hover:bg-[#ffe088]"
                      >
                        SAVE FORMULATION
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Customer Orders & Logistics</h3>
            <div className="bg-[#1d1b1a] border border-[#4d4635]/30 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-[12px] font-body-sm">
                <thead className="bg-[#0f0e0d] text-[#99907c] uppercase font-label-caps text-[10px] border-b border-[#4d4635]/30">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Total Payable</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4d4635]/20">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#211f1e] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#f2ca50]">{ord.orderNumber}</td>
                      <td className="p-3 text-[#e6e1df] font-semibold">{ord.customerInfo.fullName}</td>
                      <td className="p-3 text-[#d0c5af]">{ord.customerInfo.phone}</td>
                      <td className="p-3 text-[#99907c] max-w-xs truncate">{ord.customerInfo.streetAddress}, {ord.customerInfo.city}</td>
                      <td className="p-3 font-bold text-[#e6e1df]">Rs. {ord.total.toLocaleString()} ({ord.paymentMethod.toUpperCase()})</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/30">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-[#2b2a28] text-[#e6e1df] px-2 py-1 text-[11px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Warehouse Reserve Stock Adjustments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-14 object-cover bg-[#0f0e0d]" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline-sm text-[15px] text-[#e6e1df] truncate font-serif">{p.name}</h4>
                      <p className="font-body-sm text-[11px] text-[#99907c]">SKU: {p.sku}</p>
                      <div className="text-[13px] font-bold text-[#f2ca50] mt-0.5">Stock: {p.stock} units</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 border-t border-[#4d4635]/25">
                    <button
                      onClick={() => {
                        StorageService.adjustInventory(p.id, 5);
                        refresh();
                        showToast(`Deducted 5 units from ${p.name}`);
                      }}
                      className="flex-1 py-1 bg-[#2b2a28] hover:bg-[#363433] text-[#d0c5af] text-[11px] font-title-sc uppercase"
                    >
                      -5 Units
                    </button>
                    <button
                      onClick={() => {
                        const list = StorageService.getProducts();
                        const target = list.find(item => item.id === p.id);
                        if (target) {
                          target.stock += 10;
                          StorageService.saveProduct(target);
                          refresh();
                          showToast(`Restocked +10 units for ${p.name}`);
                        }
                      }}
                      className="flex-1 py-1 bg-[#745b00]/30 hover:bg-[#745b00]/60 text-[#f2ca50] text-[11px] font-title-sc uppercase font-bold border border-[#f2ca50]/30"
                    >
                      +10 Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Coupons */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 shadow-xl space-y-4">
              <h3 className="font-headline-sm text-lg text-[#e6e1df] font-serif">Create Promotional Voucher</h3>
              <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="CODE (e.g. EIDVIP)"
                  className="px-3 py-2 bg-[#211f1e] text-[#e6e1df] font-mono text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                />
                <input
                  type="number"
                  required
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  placeholder="Discount PKR (e.g. 750)"
                  className="px-3 py-2 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] font-bold uppercase"
                >
                  Create Code
                </button>
              </form>
            </div>

            <div className="bg-[#1d1b1a] border border-[#4d4635]/30 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-[12px] font-body-sm">
                <thead className="bg-[#0f0e0d] text-[#99907c] uppercase font-label-caps text-[10px] border-b border-[#4d4635]/30">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Usage Count</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4d4635]/20">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[#211f1e]">
                      <td className="p-3 font-mono font-bold text-[#f2ca50]">{c.code}</td>
                      <td className="p-3 text-[#e6e1df]">
                        {c.discountType === 'fixed' ? `Rs. ${c.discountValue}` : `${c.discountValue}%`}
                      </td>
                      <td className="p-3 text-[#99907c]">Rs. {c.minOrderAmount}</td>
                      <td className="p-3 text-[#d0c5af]">{c.usageCount} applied</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${c.isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleCoupon(c)}
                          className="px-3 py-1 bg-[#2b2a28] hover:bg-[#363433] text-[#d0c5af] text-[10px] uppercase"
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Customer Olfactory Reviews Moderation</h3>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[15px] text-[#e6e1df] font-semibold">{rev.title}</span>
                      <span className="text-[#f2ca50]">★ {rev.rating}/5</span>
                      <span className="bg-[#f2ca50]/20 text-[#f2ca50] font-label-caps text-[9px] px-1.5 py-0.2 uppercase">
                        {rev.productName}
                      </span>
                    </div>
                    <p className="font-body-sm text-[12px] text-[#d0c5af]">"{rev.comment}"</p>
                    <span className="font-body-sm text-[11px] text-[#99907c]">By {rev.authorName} ({rev.authorLocation})</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-[#211f1e] text-[#f2ca50]">
                      {rev.status}
                    </span>
                    <button
                      onClick={() => {
                        StorageService.deleteReview(rev.id);
                        refresh();
                        showToast('Review removed.');
                      }}
                      className="px-2.5 py-1 bg-red-950/40 text-red-400 text-[11px] uppercase border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Homepage Settings */}
        {activeTab === 'settings' && (
          <div className="bg-[#1d1b1a] p-6 sm:p-8 border border-[#4d4635]/30 shadow-2xl max-w-2xl space-y-4">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Storefront Content Settings</h3>
            
            <div className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Free Delivery Threshold (PKR)</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40"
                  />
                </div>
                <div>
                  <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Standard Shipping Surcharge (PKR)</label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Hero Headline Text</label>
                <input
                  type="text"
                  value={settingsForm.heroHeadline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40"
                />
              </div>

              <div>
                <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Hero Highlight (Gold Italic)</label>
                <input
                  type="text"
                  value={settingsForm.heroHighlight}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHighlight: e.target.value })}
                  className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40"
                />
              </div>

              <div>
                <label className="block text-[#d0c5af] font-label-caps text-[10px] uppercase mb-1">Hero Supporting Text</label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubtext}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtext: e.target.value })}
                  className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] border border-[#4d4635]/40 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => updateSiteSettings(settingsForm)}
                className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffe088]"
              >
                UPDATE STOREFRONT SETTINGS
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: Supabase Cloud Database */}
        {activeTab === 'database' && (
          <div className="space-y-6 max-w-4xl">
            {/* Connection Credentials Card */}
            <div className="bg-[#1d1b1a] p-6 sm:p-8 border border-[#f2ca50]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4d4635]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">database</span>
                    <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">
                      Supabase Cloud Database Connection
                    </h3>
                  </div>
                  <p className="font-body-sm text-[12px] text-[#99907c] mt-1">
                    Connected to your dedicated Supabase PostgreSQL project for live customer data, orders, and inquiries.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-label-caps text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    Configured & Ready
                  </span>
                </div>
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/40 space-y-1">
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider block">
                    Supabase Project ID
                  </span>
                  <code className="text-[#e6e1df] font-mono select-all block bg-[#141312] p-1.5 border border-[#4d4635]/30">
                    {SUPABASE_PROJECT_ID}
                  </code>
                </div>

                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/40 space-y-1">
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider block">
                    Supabase REST Endpoint URL
                  </span>
                  <code className="text-[#e6e1df] font-mono select-all block bg-[#141312] p-1.5 border border-[#4d4635]/30 truncate">
                    {SUPABASE_URL}
                  </code>
                </div>

                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/40 space-y-1 md:col-span-2">
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider block">
                    Publishable / Anon API Key
                  </span>
                  <code className="text-[#e6e1df] font-mono select-all block bg-[#141312] p-1.5 border border-[#4d4635]/30 truncate">
                    {SUPABASE_ANON_KEY}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={testingSupabase}
                  onClick={async () => {
                    setTestingSupabase(true);
                    const res = await SupabaseService.checkConnection();
                    setTestingSupabase(false);
                    setSupabaseStatus(res.message);
                    showToast(res.message, res.connected ? 'success' : 'error');
                  }}
                  className="px-4 py-2.5 bg-[#2b2a28] hover:bg-[#363433] text-[#e6e1df] font-title-sc text-[11px] uppercase tracking-wider border border-[#4d4635]/60 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">
                    {testingSupabase ? 'sync' : 'network_check'}
                  </span>
                  <span>{testingSupabase ? 'Testing Connection...' : 'Test Supabase Connection'}</span>
                </button>

                <button
                  type="button"
                  disabled={syncingSupabase}
                  onClick={async () => {
                    setSyncingSupabase(true);
                    try {
                      const res = await SupabaseService.syncAllLocalData(
                        orders,
                        user,
                        StorageService.getSubscribers()
                      );
                      showToast(`Synced ${res.syncedOrders} orders, ${res.syncedCustomers} customers, and ${res.syncedSubscribers} subscribers to Supabase.`);
                    } catch (e: any) {
                      showToast('Failed to sync to Supabase: ' + e?.message, 'error');
                    } finally {
                      setSyncingSupabase(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {syncingSupabase ? 'hourglass_top' : 'cloud_upload'}
                  </span>
                  <span>{syncingSupabase ? 'Syncing...' : 'Sync All Orders & Customers Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCopiedSql(true);
                    showToast('Supabase SQL Schema copied! Paste into Supabase SQL Editor.');
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="px-4 py-2.5 bg-[#211f1e] hover:bg-[#2b2a28] text-[#f2ca50] font-title-sc text-[11px] uppercase tracking-wider border border-[#f2ca50]/30 flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedSql ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSql ? 'Schema Copied!' : 'Copy Supabase SQL Setup Schema'}</span>
                </button>
              </div>

              {supabaseStatus && (
                <div className="p-3 bg-[#141312] border border-[#f2ca50]/20 text-[12px] text-[#e6e1df] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">info</span>
                  <span>{supabaseStatus}</span>
                </div>
              )}
            </div>

            {/* Sync Architecture Information Card */}
            <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 shadow-2xl space-y-4">
              <h4 className="font-headline-sm text-lg text-[#e6e1df] font-serif">
                Automated Customer Data Sync Protocol
              </h4>
              <p className="font-body-sm text-[13px] text-[#d0c5af]">
                The storefront is now connected to your Supabase account. All customer details and interactions are automatically captured and dispatched in real time:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/30">
                  <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider block mb-1">
                    1. Customer Profiles (`customers`)
                  </span>
                  <p className="text-[#99907c]">
                    Saves full name, email, phone number, delivery address, city, and account role upon customer checkout or profile update.
                  </p>
                </div>

                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/30">
                  <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider block mb-1">
                    2. Customer Orders (`orders`)
                  </span>
                  <p className="text-[#99907c]">
                    Saves complete invoice breakdown, items JSON, courier tracking number, delivery address, payment method (COD/Card/Raast), and status.
                  </p>
                </div>

                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/30">
                  <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider block mb-1">
                    3. Newsletter Subscribers (`subscribers`)
                  </span>
                  <p className="text-[#99907c]">
                    Captures all patron email registrations from the header, footer, and launch banner with timestamp.
                  </p>
                </div>

                <div className="p-3 bg-[#211f1e] border border-[#4d4635]/30">
                  <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider block mb-1">
                    4. Concierge Inquiries (`contact_messages`)
                  </span>
                  <p className="text-[#99907c]">
                    Stores corporate gifting requests and patron support inquiries directly in Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
