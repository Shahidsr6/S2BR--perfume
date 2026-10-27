import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { Order, OrderStatus } from '../types';
import { useApp } from '../context/AppContext';

export const OrderTrackingPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('S2BR-PK-8840');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    return StorageService.getOrderByIdOrNumber('S2BR-PK-8840') || StorageService.getOrders()[0] || null;
  });
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = StorageService.getOrderByIdOrNumber(searchQuery);
    setSearchedOrder(found || null);
    setSearched(true);
  };

  const statusSteps: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered'
  ];

  const getStepIndex = (status: OrderStatus) => {
    const map: Record<OrderStatus, number> = {
      'Pending': 0,
      'Confirmed': 1,
      'Processing': 2,
      'Packed': 3,
      'Shipped': 4,
      'Out for Delivery': 4,
      'Delivered': 5,
      'Cancelled': -1
    };
    return map[status] ?? 0;
  };

  const currentStep = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            Nationwide Logistics Dispatch
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif">
            Track Your S2BR Consignment
          </h1>
          <p className="font-body-md text-[14px] text-[#d0c5af] max-w-lg mx-auto">
            Real-time fulfillment tracking across Lahore, Karachi, Islamabad, and nationwide destinations via TCS & Leopard Express.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#1d1b1a] p-6 shadow-2xl border border-[#f2ca50]/30 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-3 text-[#99907c] text-[18px]">
                local_shipping
              </span>
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order # (e.g. S2BR-PK-8840) or Phone"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f0e0d] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              TRACK
            </button>
          </form>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#99907c]">
            <span>Try sample order: <button onClick={() => { setSearchQuery('S2BR-PK-8840'); setSearchedOrder(StorageService.getOrderByIdOrNumber('S2BR-PK-8840') || null); }} className="text-[#f2ca50] underline">S2BR-PK-8840</button></span>
            <span>24/7 Live Status</span>
          </div>
        </div>

        {/* Results */}
        {searched && searchedOrder ? (
          <div className="bg-[#1d1b1a] p-6 sm:p-8 shadow-2xl border border-[#4d4635]/30 space-y-8">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#4d4635]/30 gap-4">
              <div>
                <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-wider">
                  Verified Consignment
                </span>
                <h3 className="font-headline-sm text-2xl text-[#e6e1df] font-serif font-bold">
                  {searchedOrder.orderNumber}
                </h3>
                <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 px-3 py-1 font-label-caps text-[11px] font-bold uppercase tracking-wider">
                  Status: {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block mb-4">
                Consignment Progression Timeline
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {statusSteps.map((step, idx) => {
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border ${
                        isDone
                          ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50]'
                          : 'bg-[#211f1e] text-[#99907c] border-[#4d4635]/40'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`font-title-sc text-[10px] uppercase tracking-wider ${
                        isCurrent ? 'text-[#f2ca50] font-bold' : isDone ? 'text-[#e6e1df]' : 'text-[#99907c]'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status History Logs */}
            <div className="bg-[#0f0e0d] p-4 border border-[#4d4635]/30 space-y-2.5">
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider block">
                Official Checkpoint Activity Logs
              </span>
              <div className="space-y-2 text-[12px] font-body-sm">
                {searchedOrder.statusHistory.map((hist, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-[#4d4635]/20 pb-1.5 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                      <span className="text-[#e6e1df] font-semibold">{hist.status}:</span>
                      <span className="text-[#d0c5af]">{hist.note || 'Processed at regional facility'}</span>
                    </div>
                    <span className="text-[#99907c] text-[11px] shrink-0">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient & Items Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block">Delivery Destination</span>
                <p className="font-body-md text-[13px] text-[#e6e1df] font-semibold">{searchedOrder.customerInfo.fullName}</p>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">{searchedOrder.customerInfo.streetAddress}</p>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">{searchedOrder.customerInfo.city}, {searchedOrder.customerInfo.province}</p>
                <p className="font-body-sm text-[11px] text-[#99907c] pt-1">Contact: {searchedOrder.customerInfo.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="font-title-sc text-[11px] text-[#e5c365] uppercase block">Sealed Items</span>
                {searchedOrder.items.map((it, idx) => (
                  <p key={idx} className="font-body-sm text-[12px] text-[#d0c5af]">
                    • {it.quantity}x {it.productName} ({it.size}) — Rs. {it.totalPrice.toLocaleString()}
                  </p>
                ))}
                <div className="pt-2 text-[13px] font-semibold text-[#f2ca50]">
                  Total Order Value: Rs. {searchedOrder.total.toLocaleString()} ({searchedOrder.paymentMethod.toUpperCase()})
                </div>
              </div>
            </div>

          </div>
        ) : searched ? (
          <div className="bg-[#1d1b1a] p-10 text-center border border-[#4d4635]/30 space-y-3">
            <span className="material-symbols-outlined text-[36px] text-[#f2ca50]/50">inventory</span>
            <h3 className="font-headline-sm text-xl text-[#e6e1df]">No Matching Consignment Found</h3>
            <p className="font-body-sm text-[13px] text-[#99907c] max-w-sm mx-auto">
              We could not find an order matching "{searchQuery}". Please verify your order number or phone number, or contact WhatsApp concierge.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
