import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/ProductCard';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    navigateTo, 
    siteSettings,
    showToast 
  } = useApp();

  const [promoInput, setPromoInput] = useState('S2BRVIP');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>({
    code: 'S2BRVIP',
    discountAmount: 500
  });

  const allProducts = StorageService.getProducts();
  const recommendations = allProducts.filter(p => !cart.some(c => c.productId === p.id)).slice(0, 3);

  const isFreeShipping = cartSubtotal >= siteSettings.freeShippingThreshold;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : siteSettings.standardShippingFee;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = StorageService.validateCoupon(promoInput, cartSubtotal);
    if (res.valid && res.coupon) {
      setAppliedPromo({
        code: res.coupon.code,
        discountAmount: res.discountAmount
      });
      showToast(`Promotional code ${res.coupon.code} applied: -Rs. ${res.discountAmount.toLocaleString()}`);
    } else {
      showToast(res.error || 'Invalid voucher code.', 'error');
    }
  };

  const handleProceedCheckout = () => {
    if (cart.length === 0) {
      showToast('Your Fragrance Vault is empty. Please add a selection first.', 'info');
      return;
    }
    navigateTo('checkout');
  };

  const progressPercent = Math.min(100, Math.round((cartSubtotal / siteSettings.freeShippingThreshold) * 100));

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      
      {/* Atmosphere Glow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">
                Private Selection
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]/60" />
              <span className="font-body-sm text-[12px] text-[#99907c]">
                {cart.length} Masterpiece{cart.length === 1 ? '' : 's'} Reserved
              </span>
            </div>
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif tracking-tight">
              Your Fragrance Vault
            </h1>
          </div>

          <div className="flex items-center gap-3 text-[#99907c] font-body-sm text-[12px]">
            <span className="text-[#f2ca50] font-semibold">01 Cart</span>
            <span>—</span>
            <span className="opacity-50">02 VIP Concierge Dispatch</span>
            <span>—</span>
            <span className="opacity-50">03 Olfactory Seal</span>
          </div>
        </div>

        {/* FREE SHIPPING PROGRESS BANNER */}
        <div className="bg-[#2b2a28] p-5 sm:p-6 shadow-xl relative overflow-hidden mb-8 border border-[#f2ca50]/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center shrink-0 border border-[#f2ca50]/30">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_shipping
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-title-sc text-[12px] text-[#f2ca50] uppercase tracking-widest font-bold">
                    {isFreeShipping ? 'Privilege Unlocked' : 'Express Delivery Progress'}
                  </span>
                  <span className="bg-[#f2ca50]/20 text-[#f2ca50] text-[10px] font-label-caps px-2 py-0.5 uppercase tracking-wider">
                    {isFreeShipping ? 'Met Rs. 3,000 Threshold' : `Rs. ${(siteSettings.freeShippingThreshold - cartSubtotal).toLocaleString()} Remaining`}
                  </span>
                </div>
                <p className="font-headline-sm text-[16px] text-[#e6e1df] font-serif mt-0.5">
                  Complimentary Express Dispatch Across Pakistan
                </p>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  TCS & Leopard White-Glove Courier with insured velvet packing.
                </p>
              </div>
            </div>

            <div className="w-full md:w-72 flex flex-col gap-1.5 shrink-0">
              <div className="flex justify-between items-center font-label-caps text-[10px] text-[#e5c365] tracking-widest uppercase">
                <span>Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2 bg-[#0f0e0d] overflow-hidden border border-[#4d4635]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#745b00] via-[#f2ca50] to-[#ffe088] transition-all duration-700 shadow-[0_0_12px_rgba(242,202,80,0.5)]" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-right font-body-sm text-[11px] text-[#f2ca50]">
                {isFreeShipping ? 'Zero Delivery Surcharge' : `Add more to qualify for Free Shipping`}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="bg-[#1d1b1a] p-12 text-center border border-[#4d4635]/30 space-y-4">
            <span className="material-symbols-outlined text-[48px] text-[#f2ca50]/40">shopping_bag</span>
            <h3 className="font-headline-md text-2xl text-[#e6e1df] font-serif">Your Fragrance Vault is Empty</h3>
            <p className="font-body-md text-[14px] text-[#99907c] max-w-md mx-auto">
              You haven't reserved any bespoke flacons yet. Explore our bestsellers and discover your signature scent.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-widest hover:bg-[#ffe088] transition-colors"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          /* MAIN CART SPLIT LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Vault Items (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-[#1d1b1a] shadow-2xl border border-[#4d4635]/30">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 px-6 py-3 bg-[#0f0e0d] text-[#99907c] font-label-caps text-[10px] tracking-widest uppercase border-b border-[#4d4635]/30">
                  <div className="col-span-6">Flacon & Formulation</div>
                  <div className="col-span-2 text-center">Batch Vol</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Investment</div>
                </div>

                {/* Cart Item Rows */}
                {cart.map((item, idx) => (
                  <div 
                    key={`${item.productId}-${item.variantSize}`}
                    className={`p-4 sm:p-6 transition-colors duration-200 border-b border-[#4d4635]/25 ${
                      idx % 2 === 0 ? 'bg-[#1d1b1a]' : 'bg-[#211f1e]'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      
                      {/* Product info */}
                      <div className="sm:col-span-6 flex gap-4 items-center">
                        <div 
                          onClick={() => navigateTo('pdp', { productId: item.productId })}
                          className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#0f0e0d] shrink-0 overflow-hidden cursor-pointer border border-[#4d4635]/30"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 left-1.5 font-label-caps text-[8px] text-[#f2ca50] uppercase tracking-wider bg-[#0f0e0d]/80 px-1">
                            {item.product.category.includes('Attar') ? 'Pure Oil' : 'Extrait'}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-widest">
                            {item.product.family}
                          </span>
                          <h3 
                            onClick={() => navigateTo('pdp', { productId: item.productId })}
                            className="font-headline-sm text-[16px] text-[#e6e1df] leading-snug cursor-pointer hover:text-[#f2ca50] transition-colors truncate"
                          >
                            {item.product.name}
                          </h3>
                          <p className="font-body-sm text-[11px] text-[#99907c] truncate">
                            Notes: {item.product.notes.top.slice(0, 3).join(', ')}
                          </p>
                          <div className="flex items-center gap-3 pt-1 text-[11px] text-[#d0c5af]">
                            <span className="text-[#f2ca50]">Batch {item.product.batchNo}</span>
                            <button
                              onClick={() => removeFromCart(item.productId, item.variantSize)}
                              className="text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider text-[10px] flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[13px]">delete</span> Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Volume */}
                      <div className="sm:col-span-2 flex sm:flex-col justify-between sm:justify-center items-center">
                        <span className="sm:hidden font-body-sm text-[#99907c] text-[12px]">Volume</span>
                        <span className="font-body-md text-[13px] text-[#e6e1df] font-semibold uppercase">
                          {item.variantSize}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                        <span className="sm:hidden font-body-sm text-[#99907c] text-[12px]">Quantity</span>
                        <div className="inline-flex items-center bg-[#2b2a28] border border-[#4d4635]/40 px-2 py-1 gap-2.5">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity - 1)}
                            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-0.5"
                          >
                            <span className="material-symbols-outlined text-[15px]">remove</span>
                          </button>
                          <span className="font-label-price text-[13px] text-[#e6e1df] px-1 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity + 1)}
                            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-0.5"
                          >
                            <span className="material-symbols-outlined text-[15px]">add</span>
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="sm:col-span-2 flex sm:flex-col justify-between sm:items-end items-center">
                        <span className="sm:hidden font-body-sm text-[#99907c] text-[12px]">Total</span>
                        <div className="text-right">
                          <span className="font-label-price text-[16px] text-[#f2ca50] font-bold">
                            Rs. {(item.priceAtAddition * item.quantity).toLocaleString()}
                          </span>
                          <span className="block font-body-sm text-[9px] text-[#99907c] uppercase">PKR Net</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

                {/* COMPLIMENTARY COURTESY SAMPLE ROW */}
                <div className="p-4 sm:p-6 bg-[#211f1e] relative overflow-hidden border-t border-[#f2ca50]/20">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f2ca50]" />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 bg-[#0f0e0d] shrink-0 overflow-hidden border border-[#f2ca50]/30">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbRP7JfDerkAIKw3nvMwlHQHU-iXbVtMEM1EhqO1Jwg7k5y5qteT33G78lCFS8sa260kAAeSfpTQ2_22p0woUbod9Or2ZlcyDP76TkwxzFdWJBmxMMNjM0BZvcDjRITwD8cRlAFDYaaS8URgto9wWDMuEfo8O9ortZX-2EvNjrr-HTPfSOPZBJXSpGXDjv7HO0JQrEGyQEowxqaBDXA6sqx6hEdnydrzt2oj5tqFjhngrTbALc9zZ93w"
                          alt="Discovery Sample"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#f2ca50] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            card_giftcard
                          </span>
                          <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-widest font-bold">
                            S2BR Complimentary Courtesy
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-[15px] text-[#e6e1df] font-serif">
                          Discovery Sample: 2ml Dehn Al Oud Royale
                        </h4>
                        <p className="font-body-sm text-[11px] text-[#99907c]">
                          Complimentary miniature extrait automatically paired with your order.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="line-through text-[#99907c] font-body-sm text-[12px]">Rs. 850</span>
                      <span className="bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[10px] px-2.5 py-0.5 tracking-widest uppercase font-bold">
                        FREE
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bento Details Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1d1b1a] p-5 shadow-lg space-y-2 border border-[#4d4635]/30">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sc text-[11px] text-[#f2ca50] uppercase tracking-widest font-bold">
                      Scent Architecture
                    </span>
                    <span className="material-symbols-outlined text-[#e5c365] text-[18px]">science</span>
                  </div>
                  <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
                    Selections utilize 32% to 38% pure perfume concentration (Extrait grade) formulated for 14+ hours of projection in Pakistan's weather.
                  </p>
                </div>

                <div className="bg-[#1d1b1a] p-5 shadow-lg space-y-2 border border-[#4d4635]/30">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sc text-[11px] text-[#f2ca50] uppercase tracking-widest font-bold">
                      Presentation & Gifting
                    </span>
                    <span className="material-symbols-outlined text-[#e5c365] text-[18px]">inventory_2</span>
                  </div>
                  <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
                    Housed inside our signature rigid black matte magnetic presentation box with gold seal emblem and velvet inner flacon cradling.
                  </p>
                </div>
              </div>

              {/* Bottom Nav Helper */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="inline-flex items-center gap-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors font-title-sc text-[11px] uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Continue Curating
                </button>

                <button
                  onClick={clearCart}
                  className="text-[#99907c] hover:text-red-400 transition-colors font-body-sm text-[12px] inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                  Clear Entire Vault
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Ledger (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#1d1b1a] p-6 shadow-2xl border border-[#f2ca50]/30 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f2ca50]/20 via-[#f2ca50] to-[#f2ca50]/20" />

                <h2 className="font-headline-sm text-[17px] text-[#e6e1df] uppercase tracking-wider mb-5 flex items-center justify-between font-serif">
                  Order Ledger
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">receipt_long</span>
                </h2>

                {/* Subtotals */}
                <div className="space-y-3 font-body-md text-[13px] text-[#d0c5af] pb-5 border-b border-[#4d4635]/30">
                  <div className="flex justify-between items-center">
                    <span>Vault Subtotal</span>
                    <span className="text-[#e6e1df] font-semibold">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span>Nationwide Express</span>
                      <span className="material-symbols-outlined text-[14px] text-[#f2ca50]" title="Insured Courier">info</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!isFreeShipping && (
                        <span className="text-[#99907c] line-through text-[12px]">Rs. 450</span>
                      )}
                      <span className="text-[#f2ca50] font-semibold uppercase text-[12px]">
                        {isFreeShipping ? 'FREE' : `Rs. ${shippingFee}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Luxury Hardbox & Seal</span>
                    <span className="text-[#e5c365] font-medium">Included</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Discovery Sample (2ml)</span>
                    <span className="text-[#f2ca50] font-medium">Rs. 0</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-[#f2ca50] pt-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">sell</span>
                        <span>Promo ('{appliedPromo.code}')</span>
                      </div>
                      <span className="font-medium">- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="py-4 my-2">
                  <label className="block font-label-caps text-[10px] text-[#e5c365] mb-1.5 tracking-widest uppercase">
                    Promotional Access Pass
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE (e.g. S2BRVIP)"
                        className="w-full bg-[#0f0e0d] text-[#e6e1df] px-3 py-2 font-title-sc text-[12px] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#f2ca50] border border-[#4d4635]/40"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      type="button"
                      className="bg-[#2b2a28] hover:bg-[#f2ca50] hover:text-[#3c2f00] text-[#e6e1df] px-4 py-2 font-label-caps text-[11px] uppercase transition-colors shrink-0 border border-[#f2ca50]/30 font-bold"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="font-body-sm text-[11px] text-[#f2ca50]/80 mt-1.5">
                    Active codes: <strong className="text-[#f2ca50]">S2BRVIP</strong> (Rs. 500 off) or <strong className="text-[#f2ca50]">ROYALPRIVILEGE</strong> (Rs. 1,000 off)
                  </p>
                </div>

                {/* Grand Total */}
                <div className="py-3 mb-5 bg-[#0f0e0d] p-4 flex justify-between items-baseline border border-[#4d4635]/30">
                  <div>
                    <span className="font-title-sc text-[12px] text-[#e6e1df] uppercase tracking-widest block font-bold">
                      Total Payable
                    </span>
                    <span className="font-body-sm text-[10px] text-[#99907c] uppercase">Includes all local taxes</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display-hero-mobile text-2xl sm:text-3xl text-[#f2ca50] font-bold leading-none">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                    <span className="block font-body-sm text-[11px] text-[#e5c365] tracking-wider uppercase mt-1">
                      Cash on Delivery / Raast
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2">
                  <button
                    onClick={handleProceedCheckout}
                    className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#e5c365] text-[#3c2f00] font-title-sc text-[12px] font-bold tracking-[0.2em] uppercase text-center flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition-all duration-300"
                  >
                    <span>Proceed to VIP Checkout</span>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </button>
                  <p className="text-center font-label-caps text-[10px] text-[#99907c] tracking-widest uppercase pt-1">
                    Instant Checkout With Raast or COD
                  </p>
                </div>

                {/* Trust Points */}
                <div className="mt-6 pt-4 border-t border-[#4d4635]/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px] shrink-0 mt-0.5">payments</span>
                    <div>
                      <h5 className="font-label-caps text-[10px] text-[#e6e1df] uppercase font-bold">Cash on Delivery Available</h5>
                      <p className="font-body-sm text-[11px] text-[#99907c]">Inspect parcel upon delivery anywhere in Pakistan before making payment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px] shrink-0 mt-0.5">verified_user</span>
                    <div>
                      <h5 className="font-label-caps text-[10px] text-[#e6e1df] uppercase font-bold">100% Authentic Formulation</h5>
                      <p className="font-body-sm text-[11px] text-[#99907c]">Direct from S2BR Master Distillers with serial certification tag.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px] shrink-0 mt-0.5">published_with_changes</span>
                    <div>
                      <h5 className="font-label-caps text-[10px] text-[#e6e1df] uppercase font-bold">7-Day Hassle-Free Returns</h5>
                      <p className="font-body-sm text-[11px] text-[#99907c]">Test the included 2ml discovery vial first before unwrapping the main flacon.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Concierge Assistance */}
              <div className="bg-[#1d1b1a] p-4 flex items-center justify-between gap-3 border border-[#4d4635]/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[22px]">support_agent</span>
                  <div>
                    <p className="font-title-sc text-[11px] text-[#e6e1df] uppercase">Fragrance Specialist On-Call</p>
                    <p className="font-body-sm text-[11px] text-[#99907c]">Require bespoke gift card lettering?</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/923000077227"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#f2ca50] hover:underline font-label-caps text-[11px] uppercase tracking-wider inline-flex items-center gap-1 font-bold"
                >
                  WhatsApp
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>

            </div>

          </div>
        )}

        {/* Pairing Suggestions */}
        {recommendations.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#4d4635]/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase">
                  Harmonies & Complements
                </span>
                <h3 className="font-headline-md text-2xl text-[#e6e1df] font-serif">
                  Curate Your Fragrance Wardrobe
                </h3>
              </div>
              <button
                onClick={() => navigateTo('shop')}
                className="font-title-sc text-[11px] text-[#e5c365] hover:text-[#f2ca50] uppercase tracking-wider"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
