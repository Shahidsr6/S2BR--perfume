import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { PaymentMethod, ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, navigateTo, user, siteSettings, showToast } = useApp();

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: user?.name || 'Syed Daniyal Shah',
    phone: user?.phone || '+92 300 8472910',
    email: user?.email || 'daniyal.shah@gmail.com',
    streetAddress: user?.address?.streetAddress || 'Bungalow 42-A, Street 7, Phase VI, DHA',
    city: user?.address?.city || 'Karachi',
    province: user?.address?.province || 'Sindh',
    postalCode: user?.address?.postalCode || '75500',
    specialNotes: user?.address?.specialNotes || 'Ring secondary bell, call rider 15 mins prior'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [promoCode, setPromoCode] = useState('ROYALPRIVILEGE');
  const [discountAmount, setDiscountAmount] = useState(1000);
  const [submitting, setSubmitting] = useState(false);

  const isFreeShipping = cartSubtotal >= siteSettings.freeShippingThreshold || cart.length === 0;
  const shippingFee = isFreeShipping ? 0 : siteSettings.standardShippingFee;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const cities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Peshawar',
    'Multan',
    'Sialkot',
    'Quetta',
    'Gujranwala',
    'Hyderabad',
    'Other District'
  ];

  const provinces = [
    'Sindh',
    'Punjab',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Azad Jammu & Kashmir',
    'Gilgit-Baltistan'
  ];

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.streetAddress) {
      showToast('Please provide your complete name, phone, and delivery address.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your Fragrance Vault has no items.', 'error');
      navigateTo('shop');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const order = StorageService.createOrder({
        customerInfo: shipping,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          size: item.variantSize,
          quantity: item.quantity,
          unitPrice: item.priceAtAddition,
          totalPrice: item.priceAtAddition * item.quantity,
          image: item.product.images[0]
        })),
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        couponCode: promoCode,
        total: grandTotal,
        paymentMethod,
        status: 'Pending',
        hasComplimentaryGift: true,
        trackingNumber: `TCS-PK-${Math.floor(100000 + Math.random() * 900000)}`
      });

      clearCart();
      setSubmitting(false);
      showToast(`Order #${order.orderNumber} placed successfully!`);
      navigateTo('order-success', { orderId: order.id });
    }, 1200);
  };

  const paymentButtonLabels: Record<PaymentMethod, string> = {
    cod: 'Complete Order (Cash on Delivery)',
    card: 'Proceed to 3D Secure Card Payment',
    raast: 'Generate Raast Instant Payment QR',
    wallet: 'Authorize Mobile Wallet Transfer'
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0e0d] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-[#f2ca50]/20">
          <div className="space-y-1">
            <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest block uppercase">
              Bespoke Olfactory Parfums
            </span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif tracking-tight">
              S2BR Fragrance Atelier
            </h1>
            <p className="font-body-sm text-[12px] text-[#99907c]">
              Secure Haute Parfumerie Dispatch • Express Courier Across Pakistan
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#1d1b1a] px-4 py-2 border border-[#f2ca50]/30">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">lock</span>
            <span className="font-label-caps text-[10px] text-[#e6e1df] tracking-widest uppercase">
              256-Bit SSL Encrypted Escrow
            </span>
          </div>
        </div>

        {/* Form & Ledger Grid */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Customer Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Destination Address */}
            <section className="bg-[#1d1b1a] p-6 sm:p-8 shadow-md border border-[#4d4635]/30">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#4d4635]/25">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-[18px] text-[#e6e1df] font-serif">
                      Recipient & Delivery Destination
                    </h2>
                    <p className="font-body-sm text-[12px] text-[#99907c]">
                      Domestic express fulfillment via Trax & TCS Luxury Cargo
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-[#e5c365] hidden sm:inline-block uppercase">
                  Step 01 / 02
                </span>
              </div>

              <div className="space-y-4">
                
                {/* Full Legal Name */}
                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#99907c] text-[18px] pointer-events-none">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Syed Daniyal Shah"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                      WhatsApp / Contact (+92)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#99907c] text-[18px] pointer-events-none">
                        call
                      </span>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+92 3XX XXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                      />
                    </div>
                    <p className="font-body-sm text-[10px] text-[#99907c]">SMS & WhatsApp consignment dispatch alerts</p>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#99907c] text-[18px] pointer-events-none">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={shipping.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="patron@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                      />
                    </div>
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                    Street Address & House / Apartment Suite
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#99907c] text-[18px] pointer-events-none">
                      location_on
                    </span>
                    <input
                      type="text"
                      required
                      value={shipping.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      placeholder="Bungalow #, Street name, Phase, Sector, Landmark"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                </div>

                {/* City & Province Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                      Destination City
                    </label>
                    <select
                      value={shipping.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city} className="bg-[#1d1b1a]">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                      Province / Territory
                    </label>
                    <select
                      value={shipping.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
                    >
                      {provinces.map((prov) => (
                        <option key={prov} value={prov} className="bg-[#1d1b1a]">
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Delivery Instructions */}
                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={shipping.specialNotes}
                    onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                    placeholder="e.g. Ring secondary bell, call rider 15 mins prior, leave with estate guard"
                    className="w-full px-4 py-2 bg-[#211f1e] text-[#e6e1df] font-body-md text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] resize-none"
                  />
                </div>

              </div>
            </section>

            {/* Step 2: Payment Mechanism */}
            <section className="bg-[#1d1b1a] p-6 sm:p-8 shadow-md border border-[#4d4635]/30">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#4d4635]/25">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-[18px] text-[#e6e1df] font-serif">
                      Payment Mechanism
                    </h2>
                    <p className="font-body-sm text-[12px] text-[#99907c]">
                      Select your preferred transaction channel
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-[#e5c365] hidden sm:inline-block uppercase">
                  Step 02 / 02
                </span>
              </div>

              <div className="space-y-3">
                
                {/* Cash on Delivery (COD) */}
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`cursor-pointer block p-4 border transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#211f1e] border-[#f2ca50] shadow-md'
                      : 'bg-[#211f1e]/60 border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-[#f2ca50] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-headline-sm text-[15px] text-[#e6e1df] font-bold">
                            Cash on Delivery (COD)
                          </span>
                          <span className="bg-[#f2ca50]/20 text-[#f2ca50] font-label-caps text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
                            Most Popular
                          </span>
                        </div>
                        <p className="font-body-md text-[12px] text-[#d0c5af] mt-1 leading-snug">
                          Pay with exact cash or mobile transfer directly to courier doorstep agent upon arrival.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">local_atm</span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="mt-3 pt-2 text-[11px] text-[#e5c365] flex items-center gap-2 bg-[#2b2a28]/60 p-2 border-t border-[#f2ca50]/20">
                      <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">verified_user</span>
                      <span>Inspected batch verified before sealing. No advance deposit mandated.</span>
                    </div>
                  )}
                </label>

                {/* Online Card Payment */}
                <label 
                  onClick={() => setPaymentMethod('card')}
                  className={`cursor-pointer block p-4 border transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#211f1e] border-[#f2ca50] shadow-md'
                      : 'bg-[#211f1e]/60 border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 accent-[#f2ca50] cursor-pointer"
                      />
                      <div>
                        <span className="font-headline-sm text-[15px] text-[#e6e1df] font-bold">
                          Online Card Payment
                        </span>
                        <p className="font-body-md text-[12px] text-[#d0c5af] mt-1 leading-snug">
                          Visa, Mastercard, UnionPay & PayPak protected by 3D Secure OTP authentication.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#d0c5af] text-[24px]">credit_card</span>
                  </div>
                </label>

                {/* Raast / Direct Bank Transfer */}
                <label 
                  onClick={() => setPaymentMethod('raast')}
                  className={`cursor-pointer block p-4 border transition-all ${
                    paymentMethod === 'raast'
                      ? 'bg-[#211f1e] border-[#f2ca50] shadow-md'
                      : 'bg-[#211f1e]/60 border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'raast'}
                        onChange={() => setPaymentMethod('raast')}
                        className="mt-1 accent-[#f2ca50] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-headline-sm text-[15px] text-[#e6e1df] font-bold">
                            Raast / Direct Bank Transfer
                          </span>
                          <span className="bg-[#e5c365]/20 text-[#e5c365] font-label-caps text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
                            0% Surcharge
                          </span>
                        </div>
                        <p className="font-body-md text-[12px] text-[#d0c5af] mt-1 leading-snug">
                          State Bank of Pakistan Raast instant ID (s2br@raast) or IBAN transfer.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#e5c365] text-[24px]">account_balance</span>
                  </div>
                </label>

                {/* JazzCash / EasyPaisa Wallet */}
                <label 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`cursor-pointer block p-4 border transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#211f1e] border-[#f2ca50] shadow-md'
                      : 'bg-[#211f1e]/60 border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                        className="mt-1 accent-[#f2ca50] cursor-pointer"
                      />
                      <div>
                        <span className="font-headline-sm text-[15px] text-[#e6e1df] font-bold">
                          JazzCash / EasyPaisa Wallet
                        </span>
                        <p className="font-body-md text-[12px] text-[#d0c5af] mt-1 leading-snug">
                          Prompt wallet push payment notification delivered directly to your cellular account.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#d0c5af] text-[24px]">phonelink_ring</span>
                  </div>
                </label>

              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Order Summary Ledger (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#1d1b1a] p-6 shadow-2xl border border-[#f2ca50]/30">
              <div className="flex items-center justify-between pb-4 border-b border-[#4d4635]/30">
                <h3 className="font-headline-md text-xl text-[#e6e1df] font-serif">
                  Fragrance Vault
                </h3>
                <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider">
                  {cart.length} Item{cart.length === 1 ? '' : 's'} Reserved
                </span>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-3.5 border-b border-[#4d4635]/30">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantSize}`} className="flex items-center gap-3.5">
                    <div className="w-16 h-20 bg-[#0f0e0d] shrink-0 overflow-hidden border border-[#4d4635]/30">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-label-caps text-[9px] text-[#f2ca50] uppercase block">
                        {item.variantSize} • {item.product.category.includes('Attar') ? 'Pure Oil' : 'Extrait'}
                      </span>
                      <h4 className="font-headline-sm text-[14px] text-[#e6e1df] truncate font-serif">
                        {item.product.name}
                      </h4>
                      <p className="font-body-sm text-[11px] text-[#99907c] truncate">
                        {item.product.notes.top.slice(0, 2).join(' • ')}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="font-body-sm text-[11px] text-[#99907c]">Qty: {item.quantity}</span>
                        <span className="font-label-price text-[14px] text-[#f2ca50] font-bold">
                          Rs. {(item.priceAtAddition * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Applied Badge */}
              <div className="py-3 border-b border-[#4d4635]/30">
                <div className="flex items-center justify-between bg-[#211f1e] p-2.5 border border-[#f2ca50]/20">
                  <span className="font-title-sc text-[11px] text-[#f2ca50] tracking-widest font-bold">
                    {promoCode}
                  </span>
                  <span className="font-label-caps text-[10px] bg-[#f2ca50] text-[#3c2f00] px-2 py-0.5 font-bold">
                    APPLIED
                  </span>
                </div>
              </div>

              {/* Calculations */}
              <div className="py-4 space-y-2.5 font-body-md text-[13px] text-[#d0c5af] border-b border-[#4d4635]/30">
                <div className="flex justify-between">
                  <span>Gross Product Subtotal</span>
                  <span className="text-[#e6e1df]">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#f2ca50]">
                  <span>Private Club Promo ({promoCode})</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Express Doorstep Dispatch (Nationwide)</span>
                  <span className="text-[#f2ca50] font-title-sc text-[11px] uppercase font-bold">
                    {isFreeShipping ? 'Free Delivery' : `Rs. ${shippingFee}`}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-baseline border-t border-[#4d4635]/25">
                  <div>
                    <span className="font-headline-sm text-[16px] text-[#e6e1df] block font-serif">
                      Total Payable
                    </span>
                    <span className="font-body-sm text-[10px] text-[#99907c]">
                      Inclusive of all local duties & insurance
                    </span>
                  </div>
                  <span className="font-headline-lg text-2xl sm:text-3xl text-[#f2ca50] font-bold">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#e5c365] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>{submitting ? 'Authenticating Order...' : paymentButtonLabels[paymentMethod]}</span>
                </button>
                <p className="text-center font-body-sm text-[11px] text-[#99907c]">
                  By finalizing this acquisition, you authorize shipment dispatch to the verified address.
                </p>
              </div>

            </div>

            {/* Trust Policies Bento */}
            <div className="bg-[#1d1b1a] p-5 shadow-lg space-y-4 border border-[#4d4635]/30">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f2ca50] text-[20px] shrink-0">cached</span>
                <div>
                  <h5 className="font-title-sc text-[11px] text-[#e6e1df] uppercase font-bold">
                    7-Day Easy Exchange Protocol
                  </h5>
                  <p className="font-body-sm text-[11px] text-[#d0c5af]">
                    Every bottle is dispatched alongside a 2ml trial decant. Test before breaking the master flacon seal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f2ca50] text-[20px] shrink-0">inventory_2</span>
                <div>
                  <h5 className="font-title-sc text-[11px] text-[#e6e1df] uppercase font-bold">
                    Discreet & Climate-Insulated Packaging
                  </h5>
                  <p className="font-body-sm text-[11px] text-[#d0c5af]">
                    Double-cushioned thermal velvet wrapping prevents transit shock and heat degradation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f2ca50] text-[20px] shrink-0">workspace_premium</span>
                <div>
                  <h5 className="font-title-sc text-[11px] text-[#e6e1df] uppercase font-bold">
                    Certified Haute Parfumerie
                  </h5>
                  <p className="font-body-sm text-[11px] text-[#d0c5af]">
                    High-concentration formulas meticulously compounded with IFRA-compliant natural resins.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
