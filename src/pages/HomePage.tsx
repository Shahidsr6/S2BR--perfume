import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import { FragranceFamily } from '../types';

export const HomePage: React.FC = () => {
  const { navigateTo, siteSettings, showToast } = useApp();
  const [selectedAccord, setSelectedAccord] = useState<string>('All Accords');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterClaimed, setNewsletterClaimed] = useState(false);

  const products = useMemo(() => StorageService.getProducts(), []);

  const accords: string[] = [
    'All Accords',
    'Royal Oud',
    'Oriental Spicy',
    'Woody Smoky',
    'French Floral',
    'Sweet Amber',
    'Leather & Tobacco'
  ];

  const filteredProducts = useMemo(() => {
    if (selectedAccord === 'All Accords') {
      return products.slice(0, 8);
    }
    return products.filter((p) => p.family === (selectedAccord as FragranceFamily));
  }, [products, selectedAccord]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    StorageService.addSubscriber(newsletterEmail);
    setNewsletterClaimed(true);
    setNewsletterEmail('');
    showToast('Your 10% voucher code S2BRVIP is active! Welcome to the Private Circle.');
  };

  return (
    <div className="flex flex-col w-full">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#0f0e0d] -mt-28">
        {/* Ambient Radial Glow Behind Bottles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#f2ca50]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-12 -left-20 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full pt-32 sm:pt-36 pb-16 flex flex-col items-center">
          
          {/* Campaign Master Artwork Display */}
          <div className="relative w-full overflow-hidden shadow-2xl bg-[#1d1b1a] group border-y border-[#f2ca50]/30">
            <div className="relative aspect-[21/9] sm:aspect-[2.3/1] lg:aspect-[2.6/1] w-full min-h-[320px] sm:min-h-[440px] lg:min-h-[540px] max-h-[720px] overflow-hidden">
              <img
                alt="S2BR Fragrances Official Launch Campaign featuring bespoke luxury bottle and regal portraiture"
                className="w-full h-full object-cover object-center transform scale-[1.01] group-hover:scale-[1.03] transition-transform duration-1000 select-none"
                src="/public/assets/aistudio/Image_2_745f6932.png"
              />
              {/* Subtle vignette overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-[#141312]/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e0d]/80 via-transparent to-[#0f0e0d]/70 hidden md:block" />
            </div>
          </div>

          {/* Hero Typography & Direct Call-To-Actions */}
          <div className="relative z-10 -mt-16 md:-mt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <div className="px-6 py-8 bg-[#1d1b1a]/95 backdrop-blur-md shadow-2xl border border-[#f2ca50]/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2b2a28] mb-3 border border-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[#f2ca50] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                award_star
              </span>
              <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.25em] uppercase">
                The Crown Jewels Of Haute Parfumerie
              </span>
            </div>

            <h1 className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#e6e1df] tracking-tight mb-3 font-serif">
              {siteSettings.heroHeadline}{' '}
              <span className="italic text-[#f2ca50] font-serif font-bold">
                {siteSettings.heroHighlight}
              </span>
            </h1>

            <p className="font-body-lg text-[14px] md:text-[16px] text-[#d0c5af] max-w-2xl mx-auto mb-6 leading-relaxed">
              {siteSettings.heroSubtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#e5c365] text-[#3c2f00] font-title-sc text-[12px] font-bold tracking-widest shadow-lg shadow-[#f2ca50]/20 hover:shadow-[#f2ca50]/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                <span>SHOP COLLECTION</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <a
                href="#best-sellers"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#2b2a28] hover:bg-[#3b3937] text-[#e6e1df] font-title-sc text-[12px] font-semibold tracking-widest transition-colors flex items-center justify-center gap-2 border border-[#4d4635]/40"
              >
                <span>EXPLORE BEST SELLERS</span>
                <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">verified</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* LUXURY TRUST PILLARS */}
      <section className="w-full bg-[#1d1b1a] py-8 border-y border-[#f2ca50]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="flex items-center gap-3 p-4 bg-[#211f1e] border border-[#4d4635]/30">
              <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center shrink-0 text-[#f2ca50]">
                <span className="material-symbols-outlined text-[26px]">timer</span>
              </div>
              <div>
                <h4 className="font-title-sc text-[12px] text-[#e6e1df] uppercase tracking-wider">
                  16+ Hours Wear
                </h4>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  Extrait de parfum oil concentration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#211f1e] border border-[#4d4635]/30">
              <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center shrink-0 text-[#f2ca50]">
                <span className="material-symbols-outlined text-[26px]">inventory_2</span>
              </div>
              <div>
                <h4 className="font-title-sc text-[12px] text-[#e6e1df] uppercase tracking-wider">
                  Artisanal Flacons
                </h4>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  Handcrafted luxury presentation box
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#211f1e] border border-[#4d4635]/30">
              <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center shrink-0 text-[#f2ca50]">
                <span className="material-symbols-outlined text-[26px]">local_shipping</span>
              </div>
              <div>
                <h4 className="font-title-sc text-[12px] text-[#e6e1df] uppercase tracking-wider">
                  Fast Delivery
                </h4>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  2-4 Days nationwide via courier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#211f1e] border border-[#4d4635]/30">
              <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center shrink-0 text-[#f2ca50]">
                <span className="material-symbols-outlined text-[26px]">published_with_changes</span>
              </div>
              <div>
                <h4 className="font-title-sc text-[12px] text-[#e6e1df] uppercase tracking-wider">
                  7-Day Exchange
                </h4>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  Includes test vial guarantee
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OLFACTORY MOOD FILTER PILLS */}
      <section className="w-full bg-[#141312] pt-16 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-label-caps text-[11px] text-[#e5c365] uppercase tracking-[0.3em] mb-2">
            Catering to Discerning Tastes
          </p>
          <h2 className="font-headline-md text-2xl sm:text-3xl text-[#e6e1df] font-serif mb-6">
            Navigate By Olfactory Family
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {accords.map((accord) => (
              <button
                key={accord}
                onClick={() => setSelectedAccord(accord)}
                className={`px-5 py-2 font-label-caps text-[11px] uppercase transition-all border ${
                  selectedAccord === accord
                    ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-bold shadow-md'
                    : 'bg-[#211f1e] text-[#d0c5af] border-[#4d4635]/30 hover:border-[#f2ca50]/50 hover:text-[#f2ca50]'
                }`}
                type="button"
              >
                {accord}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS PRODUCT GRID */}
      <section className="w-full bg-[#141312] py-12" id="best-sellers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.25em] uppercase">
                Most Coveted Creations
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif mt-1">
                Best Sellers
              </h2>
              <p className="font-body-md text-[14px] text-[#d0c5af] mt-1">
                Discover the fragrances everyone across Pakistan is talking about.
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="mt-4 md:mt-0 font-title-sc text-[12px] text-[#e5c365] hover:text-[#f2ca50] transition-colors flex items-center gap-1.5 self-start md:self-auto uppercase tracking-wider"
            >
              <span>VIEW FULL VAULT ({products.length})</span>
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT SHOWCASE: SCENTS FOR HIM & HER */}
      <section className="w-full bg-[#0f0e0d] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* For Him Showcase */}
            <div className="relative bg-[#1d1b1a] overflow-hidden group min-h-[460px] flex flex-col justify-end p-8 sm:p-10 shadow-xl border border-[#4d4635]/30">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKb_5pmhVyztX9deLg90RbjLJeC3g5Z810dTNaSz_0UwBjXEVxUy6NkgTKksPIuc_tau3x9wxepP3VWWuOLQaGhKBr09CLtB1YlSww7pvlng5ODnVW114OAeTXNj-WMHcUo6Fgy_oXVjZRo0r7Ls_8-ZEqR1xB3c5Ug8zrTU-zhbvazLhlOOwm0Guhk_xtHG0EguZ7CRNBdvdVFAkIDAsFhC2rjSMunsbvSo6i1zXSSP3nuJJE8b5Dkw')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-[#0f0e0d]/80 to-transparent" />
              
              <div className="relative z-10 space-y-3">
                <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">
                  Masculine Signature
                </span>
                <h3 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif font-bold">
                  Scents For Him
                </h3>
                <p className="font-body-md text-[14px] text-[#d0c5af] max-w-md leading-relaxed">
                  Command respect with brooding woody leathers, aged ouds, smoky vetiver, and crisp royal bergamot tailored for statesmen and leaders.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('men')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2b2a28] hover:bg-[#f2ca50] hover:text-[#3c2f00] text-[#e6e1df] font-title-sc text-[12px] uppercase tracking-widest transition-all border border-[#f2ca50]/30"
                  >
                    <span>EXPLORE MEN'S VAULT</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* For Her Showcase */}
            <div className="relative bg-[#1d1b1a] overflow-hidden group min-h-[460px] flex flex-col justify-end p-8 sm:p-10 shadow-xl border border-[#4d4635]/30">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzlMHXNlfMgpitlacAtB5zfGv44ZPK53XCbVfsQB5keUq9bK1KQc-qu1Mt99WO_i-B3yov8ON-En4aL8tJpY61RR_cD-f_V1zZfuzQrTWUHZ7pFNaFSm_SpmUI1iS6FlO9E7TbGz9_R9mCjKWqm0NnMPmpyI9rzoKg-f58S0VvXVLKPEBu0Xsir7FSVNIXfpE3Sy1ype8A2EJBtOmr7pxEHXY5kBpp04xmHgD6cMJuUTeO6ZUVmQZNow')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-[#0f0e0d]/80 to-transparent" />
              
              <div className="relative z-10 space-y-3">
                <span className="font-label-caps text-[11px] text-[#e5c365] tracking-[0.3em] uppercase">
                  Ethereal Poise
                </span>
                <h3 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif font-bold">
                  Scents For Her
                </h3>
                <p className="font-body-md text-[14px] text-[#d0c5af] max-w-md leading-relaxed">
                  Leave a lingering trail of intoxicating Taif rose, shimmering vanilla gourmand, tuberose, and soft white cashmere musks crafted with couture elegance.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('women')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2b2a28] hover:bg-[#e5c365] hover:text-[#3d2f00] text-[#e6e1df] font-title-sc text-[12px] uppercase tracking-widest transition-all border border-[#e5c365]/30"
                  >
                    <span>EXPLORE WOMEN'S VAULT</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OLFACTORY ARCHITECTURE & COMPOSITION SPOTLIGHT */}
      <section className="w-full bg-[#141312] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1d1b1a] p-6 sm:p-8 lg:p-12 shadow-2xl border border-[#f2ca50]/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Olfactory Pyramid Breakdown */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-[0.3em]">
                    Master Perfumer's Notes
                  </span>
                  <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#e6e1df] font-serif mt-1">
                    The Olfactory Architecture: <span className="italic text-[#f2ca50]">S2BR Noir</span>
                  </h2>
                  <p className="font-body-md text-[14px] text-[#d0c5af] mt-2 leading-relaxed">
                    A non-linear composition engineered to transition gracefully across an entire day in Pakistan's diverse climates—opening with vibrant spice and settling into deeply intoxicating resinous amber.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Top Notes */}
                  <div className="p-4 bg-[#211f1e] border-l-2 border-[#f2ca50]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-title-sc text-[12px] text-[#f2ca50] uppercase font-bold">
                        I. Head Notes (Opening 0 - 30 Mins)
                      </span>
                      <span className="font-label-caps text-[10px] text-[#99907c] tracking-widest uppercase">
                        Immediate Projection
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f2ca50]" /> Calabrian Bergamot
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f2ca50]" /> Green Cardamom Pods
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f2ca50]" /> Pink Peppercorn
                      </span>
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="p-4 bg-[#211f1e] border-l-2 border-[#e5c365]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-title-sc text-[12px] text-[#e5c365] uppercase font-bold">
                        II. Heart Notes (Hours 1 - 6)
                      </span>
                      <span className="font-label-caps text-[10px] text-[#99907c] tracking-widest uppercase">
                        The Essence
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#e5c365]" /> Black Baccara Rose
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#e5c365]" /> Smoky Cambodian Oud
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#e5c365]" /> Orris Butter
                      </span>
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="p-4 bg-[#211f1e] border-l-2 border-[#d4af37]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-title-sc text-[12px] text-[#f1c97d] uppercase font-bold">
                        III. Base Notes (Hours 6 - 18+)
                      </span>
                      <span className="font-label-caps text-[10px] text-[#99907c] tracking-widest uppercase">
                        The Lasting Aura
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f1c97d]" /> Fossilized Golden Amber
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f1c97d]" /> Italian Saddle Leather
                      </span>
                      <span className="px-3 py-1 bg-[#2b2a28] text-[#e6e1df] font-body-sm text-[12px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f1c97d]" /> Indonesian Dark Patchouli
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perfumer Metrics Visualization */}
              <div className="lg:col-span-5 bg-[#211f1e] p-6 sm:p-8 space-y-6 border border-[#4d4635]/30">
                <h4 className="font-headline-sm text-[20px] text-[#e6e1df] font-serif text-center">
                  Performance Ratings
                </h4>

                {/* Longevity Metric */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-label-caps text-[11px] uppercase text-[#d0c5af]">
                    <span>Longevity On Skin</span>
                    <span className="text-[#f2ca50] font-bold">16+ Hours (9.8 / 10)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#363433] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2ca50] w-[98%]" />
                  </div>
                  <p className="font-body-sm text-[11px] text-[#99907c]">
                    Exceptional tenacity tested across humid Karachi to dry Islamabad winters.
                  </p>
                </div>

                {/* Sillage Metric */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-label-caps text-[11px] uppercase text-[#d0c5af]">
                    <span>Sillage & Projection</span>
                    <span className="text-[#e5c365] font-bold">Enveloping & Massive (9.5 / 10)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#363433] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#745b00] to-[#e5c365] w-[95%]" />
                  </div>
                  <p className="font-body-sm text-[11px] text-[#99907c]">
                    Leaves an unmistakable scented trail up to 6 feet radius.
                  </p>
                </div>

                {/* Concentration Badge */}
                <div className="pt-2 flex items-center justify-between p-3.5 bg-[#2b2a28] border border-[#f2ca50]/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[22px]">science</span>
                    <span className="font-title-sc text-[12px] text-[#e6e1df] uppercase">
                      Concentration Ratio
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[10px] font-bold">
                    35% PURE EXTRAIT
                  </span>
                </div>

                {/* CTA for Discover Sampler */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => navigateTo('pdp', { productId: 'the-grand-discovery-wardrobe' })}
                    className="w-full py-3.5 bg-gradient-to-r from-[#f2ca50] to-[#d4af37] text-[#3c2f00] font-title-sc text-[12px] font-bold uppercase tracking-wider block shadow hover:brightness-105 transition-all"
                  >
                    ORDER DISCOVERY SAMPLER (RS. 3,800)
                  </button>
                  <span className="font-body-sm text-[11px] text-[#99907c] mt-2 block">
                    Includes 5x 5ml testers with full price credit towards bottle purchase
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY: MORE THAN A FRAGRANCE */}
      <section className="w-full bg-[#0f0e0d] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Composition */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden bg-[#211f1e] border border-[#f2ca50]/20">
                <img
                  className="w-full h-full object-cover select-none"
                  alt="Artisanal perfume apothecary in Lahore with vintage dark wood shelves and glowing crystal glass bottles"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDCdDsCQunC_tlr89P1ArsGwnWcplNElw9yJTsO2SCah16JINlGLqsZLzeGB7sonmJ8MFDEwz378yvBLWGVqA3W73Y_udnWCkxrII9qpj4-2YhZTzItaly1Pj4-bo-8M2mWhpjae9lgBU1xpn4xSdxvN5w7cZxHC0YnkcbjNvcxNRj2HJ0dI0dqn1qW_p6BsOYMVg2YW3zH6xBQPfuh12talhIbxbyIW4UfiTf77myAe36YGGiOjBH5g"
                />
              </div>

              {/* Overlapping Badge Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 p-4 sm:p-5 bg-[#2b2a28]/95 backdrop-blur-md shadow-2xl max-w-xs border border-[#f2ca50]/30 hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">verified</span>
                  <span className="font-title-sc text-[11px] text-[#f2ca50] uppercase font-bold">
                    Pure Ingredients
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#d0c5af] leading-snug">
                  Distilled without parabens, animal testing, or artificial fillers. High grade artisanal botanical oils.
                </p>
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-5">
              <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">
                The S2BR Heritage
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif leading-tight">
                More Than A Fragrance.<br />
                <span className="italic text-[#f2ca50]">It's Your Royal Signature.</span>
              </h2>
              <p className="font-body-lg text-[15px] text-[#d0c5af] leading-relaxed">
                Born out of a dedication to restore nobility to Pakistani perfumery, S2BR Fragrances blends time-honored oriental heritage with the precision of contemporary French olfactory science.
              </p>
              <p className="font-body-md text-[14px] text-[#d0c5af] leading-relaxed">
                Every bottle that leaves our ateliers in Lahore and Karachi is inspected by master blenders, bottled in high-density crystal, and cured for a minimum of 45 days to allow molecular maturation. You don’t simply wear S2BR—you leave a lasting legacy.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-8">
                <div>
                  <div className="font-headline-md text-2xl text-[#f2ca50] font-bold">120,000+</div>
                  <div className="font-label-caps text-[11px] text-[#99907c] uppercase tracking-wider">Flacons Delivered</div>
                </div>
                <div>
                  <div className="font-headline-md text-2xl text-[#f2ca50] font-bold">99.4%</div>
                  <div className="font-label-caps text-[11px] text-[#99907c] uppercase tracking-wider">Customer Approval</div>
                </div>
                <div>
                  <div className="font-headline-md text-2xl text-[#f2ca50] font-bold">38 Cities</div>
                  <div className="font-label-caps text-[11px] text-[#99907c] uppercase tracking-wider">Across Pakistan</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONNOISSEUR FEEDBACK / TESTIMONIALS */}
      <section className="w-full bg-[#141312] py-16 border-t border-[#f2ca50]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.25em] uppercase">
              Connoisseur Feedback
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif mt-1">
              Acclaimed Across Pakistan
            </h2>
            <p className="font-body-md text-[14px] text-[#d0c5af] mt-1">
              Read reviews from collectors in Lahore, Karachi, and Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="p-6 bg-[#1d1b1a] shadow-lg flex flex-col justify-between border border-[#4d4635]/30">
              <div>
                <div className="flex text-[#f2ca50] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-[13px] text-[#e6e1df] italic leading-relaxed">
                  "Imperial Noir lasted easily past 14 hours during a family wedding in Lahore's chilly December evening. Countless people asked what I was wearing. The presentation box alone is collector's grade."
                </p>
              </div>
              <div className="pt-6 border-t border-[#4d4635]/25 mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2b2a28] flex items-center justify-center font-title-sc text-[#f2ca50] font-bold border border-[#f2ca50]/30">
                  SZ
                </div>
                <div>
                  <div className="font-title-sc text-[12px] text-[#e6e1df] font-bold">Shahmeer Zaman</div>
                  <div className="font-body-sm text-[11px] text-[#99907c]">DHA Phase 6, Lahore • Verified Patron</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 bg-[#1d1b1a] shadow-lg flex flex-col justify-between border border-[#4d4635]/30">
              <div>
                <div className="flex text-[#f2ca50] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-[13px] text-[#e6e1df] italic leading-relaxed">
                  "Finding an Extrait that survives Karachi's coastal humidity is almost impossible—until S2BR. Velvet Rose & Ambergris is breathtaking. Fast 2-day delivery to Clifton was flawless."
                </p>
              </div>
              <div className="pt-6 border-t border-[#4d4635]/25 mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2b2a28] flex items-center justify-center font-title-sc text-[#f2ca50] font-bold border border-[#f2ca50]/30">
                  AK
                </div>
                <div>
                  <div className="font-title-sc text-[12px] text-[#e6e1df] font-bold">Ayesha Khanani</div>
                  <div className="font-body-sm text-[11px] text-[#99907c]">Clifton Block 4, Karachi • Verified Patron</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 bg-[#1d1b1a] shadow-lg flex flex-col justify-between border border-[#4d4635]/30">
              <div>
                <div className="flex text-[#f2ca50] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-[13px] text-[#e6e1df] italic leading-relaxed">
                  "Oud Al Sultani concentrated perfume oil matches and exceeds bottles I purchased in Dubai for triple the price. The depth of genuine oud is unmistakably authentic."
                </p>
              </div>
              <div className="pt-6 border-t border-[#4d4635]/25 mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2b2a28] flex items-center justify-center font-title-sc text-[#f2ca50] font-bold border border-[#f2ca50]/30">
                  FM
                </div>
                <div>
                  <div className="font-title-sc text-[12px] text-[#e6e1df] font-bold">Fawad Malik</div>
                  <div className="font-body-sm text-[11px] text-[#99907c]">F-7/2, Islamabad • Verified Patron</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIP CONCIERGE & PRIVILEGE NEWSLETTER */}
      <section className="w-full bg-[#0f0e0d] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-[#211f1e] to-[#1d1b1a] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden border border-[#f2ca50]/30">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#f2ca50]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#e5c365]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="material-symbols-outlined text-[#f2ca50] text-[40px]">mark_email_unread</span>
              <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
                Exclusive Patron Privileges
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif">
                Stay In The Scent
              </h2>
              <p className="font-body-md text-[14px] text-[#d0c5af] leading-relaxed">
                Join the S2BR Private Circle to receive immediate notification for small-batch reserve releases, seasonal private sales, and enjoy <span className="text-[#f2ca50] font-semibold">10% OFF</span> your very first acquisition.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-4 py-3 bg-[#0f0e0d] text-[#e6e1df] font-body-md text-[14px] placeholder-[#99907c] focus:outline-none focus:ring-1 focus:ring-[#f2ca50] border border-[#4d4635]/40"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffe088] transition-colors whitespace-nowrap shadow-md"
                >
                  CLAIM 10% OFF
                </button>
              </form>

              {newsletterClaimed && (
                <p className="font-body-sm text-[12px] text-[#e5c365] pt-2">
                  Welcome to the Private Circle. Use code <strong className="text-[#f2ca50]">S2BRVIP</strong> during checkout for your exclusive patron privilege.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
