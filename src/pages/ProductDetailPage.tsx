import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import { Review } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { selectedProductId, addToCart, navigateTo, showToast } = useApp();

  const product = useMemo(() => {
    return StorageService.getProductById(selectedProductId || 's2br-imperial-noir') || StorageService.getProducts()[0];
  }, [selectedProductId]);

  const allProducts = useMemo(() => StorageService.getProducts(), []);
  const allReviews = useMemo(() => StorageService.getReviews(), [selectedProductId]);

  const productReviews = useMemo(() => {
    return allReviews.filter((r) => r.productId === product.id && r.status === 'approved');
  }, [allReviews, product.id]);

  // Gallery state
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Variant & Quantity
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || '100ml');
  const [quantity, setQuantity] = useState(1);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');

  const currentVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, currentVariant.size, quantity);
  };

  const handleBuyNowCOD = () => {
    addToCart(product, currentVariant.size, quantity);
    navigateTo('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment || !reviewTitle) {
      showToast('Please fill out all review fields.', 'error');
      return;
    }
    StorageService.addReview({
      productId: product.id,
      productName: product.name,
      authorName: reviewAuthor,
      authorLocation: reviewLocation || 'Pakistan',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isVerified: true
    });
    setReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewAuthor('');
    setReviewLocation('');
    showToast('Your review has been verified and published. Thank you!');
  };

  const relatedProducts = useMemo(() => {
    return allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  }, [allProducts, product.id]);

  return (
    <div className="flex flex-col w-full bg-[#141312] text-[#e6e1df]">
      
      {/* Micro Breadcrumb & VIP Dispatch Badge */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-[#99907c] font-body-sm text-[12px] border-b border-[#4d4635]/25">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-[#f2ca50] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-[#f2ca50] transition-colors">Collections</button>
          <span>/</span>
          <span className="text-[#d0c5af]">{product.category}</span>
          <span>/</span>
          <span className="text-[#f2ca50] font-medium">{product.name}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#2b2a28] px-3 py-1 border border-[#f2ca50]/20 text-[#e5c365]">
          <span className="material-symbols-outlined text-[16px] text-[#f2ca50]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-label-caps text-[10px] tracking-widest uppercase text-[#e6e1df]">
            100% Authentic Artisanal Formulation
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="relative bg-[#0f0e0d] overflow-hidden aspect-[4/5] flex items-center justify-center p-6 shadow-2xl border border-[#4d4635]/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#f2ca50]/10 via-[#0f0e0d]/80 to-[#0f0e0d] pointer-events-none" />
              
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain transition-all duration-500 scale-100 hover:scale-105 select-none"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.badge && (
                  <span className="bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[10px] px-3 py-1 tracking-widest uppercase font-bold shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="bg-[#2b2a28]/90 backdrop-blur-md text-[#e5c365] font-label-caps text-[10px] px-2.5 py-1 tracking-wider uppercase border border-[#f2ca50]/20">
                  {product.concentration}
                </span>
              </div>

              {/* Lightbox Trigger */}
              <button
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-4 right-4 z-20 bg-[#2b2a28]/80 hover:bg-[#f2ca50] hover:text-[#3c2f00] text-[#d0c5af] p-2.5 backdrop-blur-md transition-all border border-[#4d4635]/40"
                aria-label="View Fullscreen"
              >
                <span className="material-symbols-outlined text-[20px]">fullscreen</span>
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((img, idx) => {
                const labels = ["Flacon", "Coffret", "Ambassador", "Atomizer"];
                const isSelected = selectedImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative aspect-square bg-[#1d1b1a] overflow-hidden p-1 transition-all border ${
                      isSelected ? 'border-[#f2ca50] ring-1 ring-[#f2ca50]' : 'border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-label-caps tracking-widest text-[#f2ca50] uppercase bg-[#0f0e0d]/90 px-1 py-0.5 whitespace-nowrap">
                      {labels[idx] || `View ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Trust Badges Under Gallery */}
            <div className="grid grid-cols-3 gap-2 bg-[#1d1b1a] p-4 text-center border border-[#4d4635]/30">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#f2ca50] text-[22px] mb-1">local_shipping</span>
                <span className="font-title-sc text-[11px] text-[#e6e1df]">Free Shipping</span>
                <span className="font-body-sm text-[11px] text-[#99907c]">Above Rs. 3,000</span>
              </div>
              <div className="flex flex-col items-center border-x border-[#4d4635]/30">
                <span className="material-symbols-outlined text-[#f2ca50] text-[22px] mb-1">workspace_premium</span>
                <span className="font-title-sc text-[11px] text-[#e6e1df]">Pure Extracts</span>
                <span className="font-body-sm text-[11px] text-[#99907c]">Grade-A Sourced</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#f2ca50] text-[22px] mb-1">published_with_changes</span>
                <span className="font-title-sc text-[11px] text-[#e6e1df]">7-Day Exchange</span>
                <span className="font-body-sm text-[11px] text-[#99907c]">Hassle Free</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Purchase Specs */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* Header Info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[11px] text-[#e5c365] tracking-[0.3em] uppercase">
                  S2BR Haute Parfumerie
                </span>
                <span className="font-body-sm text-[12px] text-[#99907c]">
                  Batch No: {product.batchNo}
                </span>
              </div>

              <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-[#f2ca50]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="font-body-sm text-[13px] font-semibold text-[#e6e1df]">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <a href="#reviews-section" className="font-body-sm text-[12px] text-[#99907c] underline hover:text-[#f2ca50] transition-colors">
                  ({productReviews.length + product.reviewCount} Verified Pakistani Reviews)
                </a>
              </div>
            </div>

            {/* Pricing Bar */}
            <div className="bg-[#1d1b1a] p-4 border border-[#4d4635]/30 flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-label-price text-2xl text-[#f2ca50] font-bold">
                  Rs. {activePrice.toLocaleString()}
                </span>
                {activeOriginalPrice && (
                  <span className="font-body-md text-[14px] text-[#99907c] line-through">
                    Rs. {activeOriginalPrice.toLocaleString()}
                  </span>
                )}
                <span className="bg-[#745b00] text-[#f8d575] px-2 py-0.5 font-label-caps text-[10px] font-bold tracking-wider uppercase">
                  SAVE 16%
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#d0c5af] flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">redeem</span>
                <span>Includes <strong>Complimentary 2ml Luxury Discovery Vial</strong> of Dehn Al Oud Royale</span>
              </p>
            </div>

            {/* Warehouse Stock Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-body-sm text-[12px] text-[#e5c365]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] animate-pulse" />
                <span className="font-medium text-[#e6e1df]">In Stock ({product.stock} Flacons Reserved)</span>
                <span className="text-[#99907c]">— Ready to dispatch from Lahore Central Logistics Hub</span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-[12px] text-[#d0c5af] bg-[#0f0e0d] px-3 py-2 border border-[#4d4635]/20">
                <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">bolt</span>
                <span>Eligible for <strong>Free Express Courier Delivery</strong> (24-48 Hours across Lahore, Karachi & Islamabad)</span>
              </div>
            </div>

            {/* Size Variant Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <span className="font-title-sc text-[12px] text-[#e6e1df] tracking-widest uppercase">
                  Select Concentration & Volume
                </span>
                <span className="font-body-sm text-[11px] text-[#f2ca50]">
                  35% Pure Extrait Grade
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedSize === v.size;
                  return (
                    <button
                      key={v.size}
                      onClick={() => setSelectedSize(v.size)}
                      className={`flex flex-col p-3 text-left transition-all border ${
                        isSelected
                          ? 'bg-[#2b2a28] border-[#f2ca50] shadow-md'
                          : 'bg-[#1d1b1a] border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-title-sc text-[12px] uppercase ${isSelected ? 'text-[#f2ca50] font-bold' : 'text-[#e6e1df]'}`}>
                          {v.size} Flacon
                        </span>
                        {v.size === '100ml' && (
                          <span className="font-label-caps text-[9px] bg-[#f2ca50] text-[#3c2f00] px-1.5 py-0.2 font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <span className="font-body-sm text-[11px] text-[#99907c] mt-0.5">{v.type}</span>
                      <span className="font-body-sm text-[12px] text-[#f2ca50] font-semibold mt-1">
                        Rs. {v.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center justify-between bg-[#2b2a28] border border-[#4d4635]/40 px-3 py-2 sm:w-36 min-h-[48px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="font-headline-sm text-[18px] text-[#e6e1df] font-semibold px-2">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#f2ca50] to-[#d4af37] hover:brightness-110 text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-widest py-3.5 px-6 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                  shopping_bag
                </span>
                <span>Add To Cart</span>
              </button>
            </div>

            {/* Buy Now COD Direct CTA */}
            <button
              onClick={handleBuyNowCOD}
              className="w-full bg-[#2b2a28] hover:bg-[#f2ca50]/20 text-[#e6e1df] hover:text-[#f2ca50] font-title-sc text-[12px] uppercase tracking-widest py-3.5 px-6 transition-all flex items-center justify-center gap-2 border border-[#f2ca50]/30"
            >
              <span className="material-symbols-outlined text-[20px] text-[#f2ca50]">local_atm</span>
              <span>Buy Now With Cash On Delivery (COD)</span>
            </button>

            {/* Longevity Gauges */}
            <div className="bg-[#1d1b1a] p-4 border border-[#4d4635]/30 space-y-3">
              <div className="flex items-center justify-between text-[#e6e1df] font-title-sc text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">schedule</span>
                  Longevity Index
                </span>
                <span className="text-[#f2ca50] font-bold">{product.longevity}</span>
              </div>
              <div className="w-full bg-[#363433] h-2 overflow-hidden">
                <div className="bg-[#f2ca50] h-full w-[92%]" />
              </div>

              <div className="flex items-center justify-between text-[#e6e1df] font-title-sc text-[11px] uppercase pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#e5c365] text-[18px]">air</span>
                  Sillage & Projection
                </span>
                <span className="text-[#e5c365] font-bold">{product.sillage}</span>
              </div>
              <div className="w-full bg-[#363433] h-2 overflow-hidden">
                <div className="bg-[#e5c365] h-full w-[85%]" />
              </div>
            </div>

            {/* Notes Pyramid Breakdown */}
            <div className="bg-[#0f0e0d] p-5 shadow-inner space-y-3.5 border border-[#4d4635]/30">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-[16px] text-[#f2ca50] tracking-wide font-serif">
                  The Olfactory Architecture
                </h3>
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase tracking-widest">
                  3-Stage Unfolding
                </span>
              </div>

              {/* Head Notes */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[#e6e1df] font-title-sc text-[11px]">
                  <span className="text-[#e5c365] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">wb_twilight</span>
                    Head Notes (Opening 0 - 30 Mins)
                  </span>
                  <span className="text-[11px] text-[#99907c]">Luminous & Spicy</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.notes.top.map((note) => (
                    <span key={note} className="px-2.5 py-1 bg-[#211f1e] text-[#e6e1df] font-body-sm text-[11px] border border-[#4d4635]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" /> {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Heart Notes */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[#e6e1df] font-title-sc text-[11px]">
                  <span className="text-[#e5c365] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">local_florist</span>
                    Heart Notes (Hours 1 - 6)
                  </span>
                  <span className="text-[11px] text-[#99907c]">Majestic & Resinous</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.notes.heart.map((note) => (
                    <span key={note} className="px-2.5 py-1 bg-[#211f1e] text-[#e6e1df] font-body-sm text-[11px] border border-[#4d4635]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e5c365]" /> {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Base Notes */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[#e6e1df] font-title-sc text-[11px]">
                  <span className="text-[#f1c97d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">fireplace</span>
                    Base Notes (Dry Down 8+ Hours)
                  </span>
                  <span className="text-[11px] text-[#99907c]">Sensual & Aristocratic</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.notes.base.map((note) => (
                    <span key={note} className="px-2.5 py-1 bg-[#211f1e] text-[#e6e1df] font-body-sm text-[11px] border border-[#4d4635]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f1c97d]" /> {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="space-y-2 pt-1">
              
              {/* Story */}
              <div className="bg-[#1d1b1a] border border-[#4d4635]/30 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
                  className="w-full flex items-center justify-between p-4 text-left font-headline-sm text-[15px] text-[#e6e1df] hover:text-[#f2ca50] transition-colors"
                >
                  <span>Fragrance Story & Creative Vision</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordion === 0 ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 0 && (
                  <div className="px-4 pb-4 pt-1 font-body-md text-[13px] text-[#d0c5af] space-y-2 leading-relaxed border-t border-[#4d4635]/20">
                    <p>{product.story || product.description}</p>
                    <p>Crafted specifically for the Pakistani climate, it ensures persistent sillage through high-temperature summers and crisp festive winter evenings without dissipating into thin air.</p>
                  </div>
                )}
              </div>

              {/* Application */}
              <div className="bg-[#1d1b1a] border border-[#4d4635]/30 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                  className="w-full flex items-center justify-between p-4 text-left font-headline-sm text-[15px] text-[#e6e1df] hover:text-[#f2ca50] transition-colors"
                >
                  <span>Art of Application & Pulse Points</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordion === 1 ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 1 && (
                  <div className="px-4 pb-4 pt-1 font-body-md text-[13px] text-[#d0c5af] space-y-2 leading-relaxed border-t border-[#4d4635]/20">
                    <p>{product.applicationGuide || "For unmatched longevity, mist from 6 inches onto warm pulse points: the carotid hollows of the neck, wrist tendons, and collarbones."}</p>
                    <p>For ceremonial gatherings or black-tie affairs, apply one light spray across lapels of linen, wool, or raw silk attire.</p>
                  </div>
                )}
              </div>

              {/* Logistics & 7-Day Exchange */}
              <div className="bg-[#1d1b1a] border border-[#4d4635]/30 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
                  className="w-full flex items-center justify-between p-4 text-left font-headline-sm text-[15px] text-[#e6e1df] hover:text-[#f2ca50] transition-colors"
                >
                  <span>Nationwide Logistics & 7-Day Exchange</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openAccordion === 2 ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 2 && (
                  <div className="px-4 pb-4 pt-1 font-body-md text-[13px] text-[#d0c5af] space-y-2 leading-relaxed border-t border-[#4d4635]/20">
                    <p>All flacons arrive cushioned in our pressurized shockproof presentation vault. We provide open-box inspection verification with major courier partners (TCS, CallCourier, Trax) prior to cash clearance.</p>
                    <p>If you test the complimentary 2ml sample vial included with the package and feel the olfactory profile does not match your personal skin chemistry, simply notify our WhatsApp concierge within 7 days for a 100% full return or exchange.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* SENSORY IMMERSION / STORY BANNER */}
      <div className="w-full bg-[#0f0e0d] py-16 border-y border-[#f2ca50]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#211f1e] p-8 lg:p-12 border border-[#f2ca50]/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase">
                  The Sovereign Collection
                </span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#e6e1df] font-serif leading-tight">
                  "A Presence That Speaks Before You Utter A Word."
                </h2>
                <p className="font-body-lg text-[15px] text-[#d0c5af] max-w-xl leading-relaxed">
                  Engineered with intense extrait concentration, {product.name} leaves an indelible signature in boardrooms, gala halls, and intimate gatherings alike.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50]">verified_user</span>
                    <span className="font-body-sm text-[12px] text-[#e6e1df]">Macerated for 90 Days in Grasse & Lahore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50]">eco</span>
                    <span className="font-body-sm text-[12px] text-[#e6e1df]">Cruelty-Free Artisanal Ingredients</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-square overflow-hidden bg-[#1d1b1a] shadow-2xl border border-[#f2ca50]/20">
                  <img
                    className="w-full h-full object-cover"
                    alt="Packaging box and flacon"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrIdH3DH7I_9vR5IMrZMMpGu1nEs7m-3a8lxZ55GGIpmm35u5N1vQUTicU2VesIN2Kni_306WQUHf1tD94rbqfediuq8g8MRFSrP-LT6QLnDMcYCoFImdONi2VfidyTIb7DIceto66eRMF3C92patjlwoOd5wNDjUxRQJa22kcj0E9TNXGmTeAue2MBgrwdu3tWfQTObN-NO22Md24wQEcwQRBj60q0mB-8ktyGjnzqACXIZ0Arw0vtA"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d]/80 via-transparent to-transparent flex items-end p-6">
                    <p className="font-headline-sm text-[16px] text-[#f2ca50] italic font-serif">
                      Signature Black & Gold Coffret Vault Included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFIED PATRON REVIEWS SECTION */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16" id="reviews-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase">
              Olfactory Dispatches
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif">
              Verified Pakistani Connoisseurs
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-headline-sm text-[18px] text-[#f2ca50] font-bold">4.9 / 5.0 Rating</div>
              <div className="font-body-sm text-[12px] text-[#99907c]">Based on 248 nationwide customer purchases</div>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="bg-[#2b2a28] hover:bg-[#363433] text-[#f2ca50] font-title-sc text-[11px] px-4 py-2.5 transition-colors uppercase tracking-wider border border-[#f2ca50]/30"
            >
              Write Review
            </button>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div key={rev.id} className="bg-[#1d1b1a] p-6 flex flex-col justify-between space-y-4 shadow-md border border-[#4d4635]/30">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#f2ca50]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-body-sm text-[11px] text-[#99907c]">{rev.date}</span>
                  </div>
                  <h4 className="font-headline-sm text-[16px] text-[#e6e1df] font-serif">"{rev.title}"</h4>
                  <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#4d4635]/25 flex items-center justify-between">
                  <div>
                    <div className="font-title-sc text-[11px] text-[#e6e1df] font-bold">{rev.authorName}</div>
                    <div className="font-body-sm text-[11px] text-[#e5c365]">Verified Buyer • {rev.authorLocation}</div>
                  </div>
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">check_circle</span>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-[#99907c] py-6">
              Be the first connoisseur to review this masterpiece!
            </p>
          )}
        </div>
      </div>

      {/* COMPLIMENTARY SAMPLER PROTOCOL BANNER */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#1d1b1a] via-[#211f1e] to-[#1d1b1a] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#f2ca50]/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50] shrink-0 border border-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[32px]">science</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[18px] text-[#e6e1df] font-serif">
                Try Risk-Free with Our Tester Protocol
              </h3>
              <p className="font-body-md text-[13px] text-[#d0c5af]">
                Each shipment arrives with an external 2ml sample vial. Test the scent on your skin first. If unsatisfied, return the unopened full bottle for full refund.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('about')}
            className="bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-semibold px-6 py-3 whitespace-nowrap hover:bg-[#ffe088] transition-colors shrink-0"
          >
            Read Guarantee Policy
          </button>
        </div>
      </div>

      {/* FREQUENTLY PAIRED EXTRAITS */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase">
              Complementary Harmonies
            </span>
            <h3 className="font-headline-md text-2xl text-[#e6e1df] font-serif mt-0.5">
              Frequently Paired With This Formulation
            </h3>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="font-title-sc text-[11px] text-[#e5c365] hover:text-[#f2ca50] uppercase tracking-wider"
          >
            Explore All Extraits →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {zoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0f0e0d]/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-6 text-[#e6e1df] hover:text-[#f2ca50] p-2"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
          <img
            src={product.images[selectedImageIdx]}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
          />
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {reviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0f0e0d]/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setReviewModalOpen(false)}
        >
          <div 
            className="relative bg-[#1d1b1a] max-w-lg w-full border border-[#f2ca50]/30 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-[#99907c] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">
              Share Your Olfactory Impression
            </h3>
            <p className="font-body-sm text-[12px] text-[#99907c] mt-1">
              Reviewing: <span className="text-[#f2ca50]">{product.name}</span>
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-label-caps text-[10px] text-[#e5c365] uppercase mb-1">
                  Rating
                </label>
                <div className="flex gap-1 text-[#f2ca50]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <span 
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: star <= reviewRating ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase mb-1">
                  Headline / Review Title
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievable longevity, sublime dry down"
                  className="w-full bg-[#211f1e] text-[#e6e1df] px-3 py-2 text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Shahmeer Z."
                    className="w-full bg-[#211f1e] text-[#e6e1df] px-3 py-2 text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. DHA, Lahore"
                    className="w-full bg-[#211f1e] text-[#e6e1df] px-3 py-2 text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase mb-1">
                  Olfactory Experience / Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the projection, silage, performance in weather, compliments received..."
                  className="w-full bg-[#211f1e] text-[#e6e1df] px-3 py-2 text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider hover:bg-[#ffe088] transition-colors"
              >
                SUBMIT CONNOISSEUR REVIEW
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
