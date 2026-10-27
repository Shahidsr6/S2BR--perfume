import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryVariant = product.variants[0] || { size: '100ml', price: product.price };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, primaryVariant.size, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateTo('pdp', { productId: product.id })}
      className="group relative bg-[#1d1b1a] rounded-none p-3 sm:p-4 flex flex-col justify-between hover:bg-[#211f1e] transition-all duration-300 shadow-md border border-[#4d4635]/30 hover:border-[#f2ca50]/40 cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative w-full aspect-[4/5] bg-[#0f0e0d] overflow-hidden flex items-center justify-center mb-3">
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[9px] uppercase font-bold tracking-widest shadow">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`wishlist-btn absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#2b2a28]/80 hover:bg-[#363433] flex items-center justify-center transition-all ${
            inWishlist ? 'text-[#f2ca50]' : 'text-[#d0c5af] hover:text-[#f2ca50]'
          }`}
          type="button"
        >
          <span 
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Bottle Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
          loading="lazy"
        />

        {/* Quick View Button overlay on hover */}
        <button
          onClick={handleQuickView}
          className="absolute inset-x-3 bottom-3 py-2 bg-[#363433]/90 backdrop-blur-md text-[#e6e1df] hover:text-[#f2ca50] font-title-sc text-[11px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-lg border border-[#f2ca50]/20"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">visibility</span>
          Quick View
        </button>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between text-[#e5c365] mb-1">
          <span className="font-label-caps text-[10px] tracking-widest uppercase text-[#99907c]">
            {product.subtitle.toUpperCase()}
          </span>
          <div className="flex items-center gap-1 text-[#f2ca50]">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-body-sm text-[12px] text-[#e6e1df] font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="font-headline-sm text-[17px] text-[#e6e1df] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1">
          {product.name}
        </h3>

        <p className="font-body-sm text-[12px] text-[#d0c5af] mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[#4d4635]/25">
          <div>
            <div className="font-label-price text-[16px] text-[#f2ca50] font-bold">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="font-body-sm text-[11px] text-[#99907c] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 transition-all duration-200 font-title-sc text-[11px] tracking-wider uppercase flex items-center gap-1.5 border ${
              justAdded
                ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50]'
                : 'bg-[#2b2a28] hover:bg-[#f2ca50] hover:text-[#3c2f00] text-[#f2ca50] border-[#f2ca50]/30'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">
              {justAdded ? 'check' : 'shopping_bag'}
            </span>
            <span>{justAdded ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
