import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo } = useApp();
  const [selectedSize, setSelectedSize] = useState<string>('100ml');

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants.find((v) => v.size === selectedSize) || quickViewProduct.variants[0];
  const activePrice = currentVariant ? currentVariant.price : quickViewProduct.price;

  const handleAdd = () => {
    addToCart(quickViewProduct, currentVariant.size, 1);
    setQuickViewProduct(null);
  };

  const handleFullDetails = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigateTo('pdp', { productId: id });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0f0e0d]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={() => setQuickViewProduct(null)}
    >
      <div 
        className="relative bg-[#1d1b1a] max-w-3xl w-full border border-[#f2ca50]/30 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close Preview" 
          className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1" 
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 aspect-square bg-[#0f0e0d] overflow-hidden flex items-center justify-center p-2 border border-[#4d4635]/30">
          <img 
            src={quickViewProduct.images[0]} 
            alt={quickViewProduct.name} 
            className="w-full h-full object-cover select-none" 
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-widest">
                {quickViewProduct.family}
              </span>
              <span className="text-[#99907c]">•</span>
              <span className="font-label-caps text-[10px] text-[#e5c365] uppercase">
                {quickViewProduct.concentration}
              </span>
            </div>

            <h3 className="font-headline-sm text-[22px] text-[#e6e1df] mt-1 font-serif leading-tight">
              {quickViewProduct.name}
            </h3>

            <div className="font-label-price text-[20px] text-[#f2ca50] mt-2 font-bold">
              Rs. {activePrice.toLocaleString()}
            </div>

            <p className="font-body-sm text-[13px] text-[#d0c5af] mt-2 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Size Variants */}
            <div className="mt-4">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase tracking-wider block mb-1.5">
                Select Volume
              </span>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`px-3 py-1.5 text-[11px] font-title-sc tracking-wider border transition-all ${
                      (currentVariant?.size === variant.size)
                        ? 'border-[#f2ca50] bg-[#f2ca50]/10 text-[#f2ca50] font-bold'
                        : 'border-[#4d4635]/40 text-[#d0c5af] hover:border-[#f2ca50]/40'
                    }`}
                  >
                    {variant.size} • Rs. {variant.price.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#4d4635]/30 space-y-2.5">
            <div className="flex items-center gap-2 text-[12px] text-[#d0c5af]">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified_user</span>
              <span>Cash on Delivery & Raast Instant Supported</span>
            </div>

            <button 
              onClick={handleAdd}
              className="w-full py-3 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider transition-colors shadow-md flex items-center justify-center gap-2" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              ADD TO BAG • RS. {activePrice.toLocaleString()}
            </button>

            <button
              onClick={handleFullDetails}
              className="w-full py-2 bg-transparent text-[#e5c365] hover:text-[#f2ca50] font-title-sc text-[11px] uppercase tracking-widest text-center hover:underline"
            >
              View Full Olfactory Profile & Performance →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
