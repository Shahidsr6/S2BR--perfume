import React from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrderId, navigateTo } = useApp();

  const orders = StorageService.getOrders();
  const order = orders.find(o => o.id === lastCreatedOrderId) || orders[0];

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Seal Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#f2ca50]/15 flex items-center justify-center border border-[#f2ca50]/40 shadow-2xl">
          <span className="material-symbols-outlined text-[#f2ca50] text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            Consignment Confirmed
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif">
            Your Masterpiece Has Been Reserved
          </h1>
          <p className="font-body-md text-[14px] text-[#d0c5af] max-w-lg mx-auto">
            Thank you for your acquisition. Our master blenders in Lahore are preparing your sealed coffret with utmost reverence.
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-[#1d1b1a] p-6 sm:p-8 text-left border border-[#f2ca50]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d4635]/30 gap-2">
              <div>
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Official Order Number</span>
                <div className="font-headline-sm text-[20px] text-[#f2ca50] font-bold font-serif">{order.orderNumber}</div>
              </div>
              <div className="sm:text-right">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Tracking Consignment</span>
                <div className="font-body-sm text-[13px] text-[#e6e1df] font-mono">{order.trackingNumber || 'TCS-EXP-LIVE'}</div>
              </div>
            </div>

            {/* Delivery Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-body-sm">
              <div>
                <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block mb-1">Recipient Destination</span>
                <p className="text-[#e6e1df] font-semibold">{order.customerInfo.fullName}</p>
                <p className="text-[#d0c5af]">{order.customerInfo.streetAddress}</p>
                <p className="text-[#d0c5af]">{order.customerInfo.city}, {order.customerInfo.province}</p>
                <p className="text-[#99907c] mt-1">{order.customerInfo.phone}</p>
              </div>

              <div>
                <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block mb-1">Dispatch Details</span>
                <p className="text-[#d0c5af]">Payment: <strong className="text-[#f2ca50] uppercase">{order.paymentMethod.toUpperCase()}</strong></p>
                <p className="text-[#d0c5af]">Status: <span className="bg-[#f2ca50]/20 text-[#f2ca50] px-2 py-0.5 text-[11px] font-bold uppercase">{order.status}</span></p>
                <p className="text-[#d0c5af] mt-1">Est. Courier Arrival: <strong className="text-[#e6e1df]">24-48 Business Hours</strong></p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="pt-4 border-t border-[#4d4635]/30 space-y-3">
              <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block">Sealed Flacons In This Consignment</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-[#4d4635]/20 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover bg-[#0f0e0d] border border-[#4d4635]/30" />
                    <div>
                      <div className="font-headline-sm text-[14px] text-[#e6e1df] font-serif">{item.productName}</div>
                      <div className="font-body-sm text-[11px] text-[#99907c]">{item.size} • Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-label-price text-[14px] text-[#f2ca50] font-bold">
                    Rs. {item.totalPrice.toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="pt-3 flex justify-between items-baseline font-body-md text-[14px]">
                <span className="font-title-sc text-[12px] text-[#e6e1df] uppercase">Total Payable on Doorstep</span>
                <span className="font-display-hero-mobile text-2xl text-[#f2ca50] font-bold">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigateTo('track')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider hover:bg-[#ffe088] transition-colors"
          >
            Track Pakistan Consignment
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2b2a28] hover:bg-[#363433] text-[#e6e1df] font-title-sc text-[12px] uppercase tracking-wider transition-colors border border-[#4d4635]/40"
          >
            Return to Vault
          </button>
        </div>

      </div>
    </div>
  );
};
