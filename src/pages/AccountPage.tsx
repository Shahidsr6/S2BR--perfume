import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/ProductCard';

export const AccountPage: React.FC = () => {
  const { user, logout, wishlist, navigateTo, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address' | 'profile'>('orders');

  if (!user) {
    return (
      <div className="w-full bg-[#141312] text-[#e6e1df] py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-[48px] text-[#f2ca50]/50">lock</span>
        <h2 className="font-headline-md text-2xl font-serif">Patron Authentication Required</h2>
        <p className="font-body-md text-[14px] text-[#99907c] max-w-sm mx-auto">
          Please sign in to access your order history, saved addresses, and reserved wishlist flacons.
        </p>
        <button
          onClick={() => navigateTo('auth')}
          className="px-8 py-3 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider hover:bg-[#ffe088]"
        >
          Sign In
        </button>
      </div>
    );
  }

  const allOrders = StorageService.getOrders();
  const allProducts = StorageService.getProducts();
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Banner */}
        <div className="bg-[#1d1b1a] p-6 sm:p-8 border border-[#f2ca50]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#2b2a28] rounded-full flex items-center justify-center font-headline-sm text-2xl text-[#f2ca50] font-bold border border-[#f2ca50]/40">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-2xl text-[#e6e1df] font-serif font-bold">
                  {user.name}
                </h1>
                <span className="bg-[#f2ca50]/20 text-[#f2ca50] font-label-caps text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
                  {user.role === 'admin' ? 'Atelier Administrator' : 'Verified Patron'}
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 bg-[#745b00] text-[#f8d575] font-title-sc text-[11px] uppercase tracking-wider hover:bg-[#745b00]/80 transition-colors font-bold"
              >
                Admin Portal
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#2b2a28] hover:bg-[#363433] text-red-400 font-title-sc text-[11px] uppercase tracking-wider transition-colors border border-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#4d4635]/40 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 font-title-sc text-[12px] uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                : 'border-transparent text-[#99907c] hover:text-[#e6e1df]'
            }`}
          >
            My Consignments ({allOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-3 font-title-sc text-[12px] uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'wishlist'
                ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                : 'border-transparent text-[#99907c] hover:text-[#e6e1df]'
            }`}
          >
            Reserved Wishlist ({wishlistProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`px-5 py-3 font-title-sc text-[12px] uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'address'
                ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                : 'border-transparent text-[#99907c] hover:text-[#e6e1df]'
            }`}
          >
            Delivery Address
          </button>
        </div>

        {/* TAB 1: My Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {allOrders.length > 0 ? (
              allOrders.map((ord) => (
                <div key={ord.id} className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4d4635]/30 gap-2">
                    <div>
                      <span className="font-headline-sm text-[16px] text-[#f2ca50] font-serif font-bold">
                        {ord.orderNumber}
                      </span>
                      <p className="font-body-sm text-[11px] text-[#99907c]">
                        Ordered on {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-[#f2ca50]/20 text-[#f2ca50] px-2.5 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-wider border border-[#f2ca50]/30">
                        {ord.status}
                      </span>
                      <button
                        onClick={() => navigateTo('track')}
                        className="text-[11px] font-title-sc text-[#e5c365] hover:text-[#f2ca50] underline uppercase"
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 text-[13px] font-body-sm">
                        <div className="flex items-center gap-3">
                          <img src={it.image} alt={it.productName} className="w-10 h-12 object-cover bg-[#0f0e0d] border border-[#4d4635]/30" />
                          <div>
                            <span className="text-[#e6e1df] font-semibold">{it.productName}</span>
                            <span className="text-[#99907c] text-[11px] block">{it.size} • Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-label-price text-[13px] text-[#f2ca50]">
                          Rs. {it.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#4d4635]/25 flex items-center justify-between font-body-sm text-[12px]">
                    <span className="text-[#99907c]">Destination: {ord.customerInfo.city}, {ord.customerInfo.province}</span>
                    <span className="text-[#f2ca50] font-bold text-[14px]">Total Paid: Rs. {ord.total.toLocaleString()} ({ord.paymentMethod.toUpperCase()})</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1d1b1a] p-12 text-center border border-[#4d4635]/30 space-y-3">
                <span className="material-symbols-outlined text-[36px] text-[#f2ca50]/50">receipt_long</span>
                <p className="font-headline-sm text-lg text-[#e6e1df]">No orders placed yet</p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-bold"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1d1b1a] p-12 text-center border border-[#4d4635]/30 space-y-3">
                <span className="material-symbols-outlined text-[36px] text-[#f2ca50]/50">favorite_border</span>
                <p className="font-headline-sm text-lg text-[#e6e1df]">Your wishlist is empty</p>
                <p className="font-body-sm text-[12px] text-[#99907c]">Tap the heart icon on any bottle to reserve it in your wishlist.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Address */}
        {activeTab === 'address' && (
          <div className="bg-[#1d1b1a] p-6 sm:p-8 border border-[#4d4635]/30 max-w-2xl space-y-4">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">Default Delivery Destination</h3>
            <div className="space-y-2 text-[13px] font-body-sm text-[#d0c5af]">
              <p className="text-[#e6e1df] font-bold text-[15px]">{user.address?.fullName || user.name}</p>
              <p>{user.address?.streetAddress || 'Bungalow 42-A, Street 7, Phase VI, DHA'}</p>
              <p>{user.address?.city || 'Karachi'}, {user.address?.province || 'Sindh'}</p>
              <p>Contact: {user.address?.phone || user.phone}</p>
            </div>
            <button
              onClick={() => showToast('Address preferences saved for future express checkout.')}
              className="mt-4 px-6 py-2.5 bg-[#2b2a28] hover:bg-[#363433] text-[#f2ca50] font-title-sc text-[11px] uppercase border border-[#f2ca50]/30"
            >
              Update Destination Details
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
