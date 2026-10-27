import React from 'react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            Artisanal Haute Parfumerie
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-5xl text-[#e6e1df] font-serif leading-tight">
            The S2BR Heritage & Philosophy
          </h1>
          <p className="font-body-lg text-[15px] text-[#d0c5af] leading-relaxed">
            Reviving royal oriental perfumery traditions with contemporary French olfactory mastery. Designed to leave a monumental, indelible trail.
          </p>
        </div>

        {/* Section 1: The Atelier */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="font-label-caps text-[11px] text-[#e5c365] uppercase tracking-widest">
              Origin & Lineage
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif">
              Born In Pakistan, Crafted for Discerning Statesmen
            </h2>
            <p className="font-body-md text-[14px] text-[#d0c5af] leading-relaxed">
              S2BR Fragrances emerged from a singular conviction: luxury perfumery in Pakistan should not merely replicate fleeting European colognes designed for cool, dry weather. Our climates demand tenacity, projection, and depth that can withstand the tropical monsoons of Karachi and the crisp winter evenings of Islamabad and Lahore.
            </p>
            <p className="font-body-md text-[14px] text-[#d0c5af] leading-relaxed">
              We source raw Grade-A botanicals from Grasse, wild oud from Assam and Cambodia, and distilled Taif roses from Saudi Arabia, aging them in small numbered batches.
            </p>
          </div>

          <div className="relative aspect-[4/3] bg-[#1d1b1a] overflow-hidden border border-[#f2ca50]/30 shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDCdDsCQunC_tlr89P1ArsGwnWcplNElw9yJTsO2SCah16JINlGLqsZLzeGB7sonmJ8MFDEwz378yvBLWGVqA3W73Y_udnWCkxrII9qpj4-2YhZTzItaly1Pj4-bo-8M2mWhpjae9lgBU1xpn4xSdxvN5w7cZxHC0YnkcbjNvcxNRj2HJ0dI0dqn1qW_p6BsOYMVg2YW3zH6xBQPfuh12talhIbxbyIW4UfiTf77myAe36YGGiOjBH5g"
              alt="S2BR Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Three Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 space-y-3">
            <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center text-[#f2ca50] border border-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <h3 className="font-headline-sm text-lg text-[#e6e1df] font-serif">35% Extrait Concentration</h3>
            <p className="font-body-sm text-[13px] text-[#d0c5af] leading-relaxed">
              Standard commercial perfumes contain 12-15% fragrance oils. S2BR formulates exclusively at 32% to 38% pure extrait, delivering unmatched 16+ hour tenacity.
            </p>
          </div>

          <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 space-y-3">
            <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center text-[#f2ca50] border border-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
            </div>
            <h3 className="font-headline-sm text-lg text-[#e6e1df] font-serif">45-Day Molecular Curing</h3>
            <p className="font-body-sm text-[13px] text-[#d0c5af] leading-relaxed">
              Each compound rests in dark, temperature-controlled maturation vaults for 45 to 90 days. This allows natural oils and natural resins to bind harmoniously.
            </p>
          </div>

          <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 space-y-3">
            <div className="w-12 h-12 bg-[#2b2a28] flex items-center justify-center text-[#f2ca50] border border-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <h3 className="font-headline-sm text-lg text-[#e6e1df] font-serif">Heirloom Presentation</h3>
            <p className="font-body-sm text-[13px] text-[#d0c5af] leading-relaxed">
              Heavy crystalline glass flacons paired with brushed gold magnetic caps and housed in rigid velvet-lined coffrets worthy of a collector's shelf.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#211f1e] via-[#2b2a28] to-[#211f1e] p-8 sm:p-12 text-center border border-[#f2ca50]/30 shadow-2xl space-y-4">
          <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif">
            Experience Haute Parfumerie in Person
          </h2>
          <p className="font-body-md text-[14px] text-[#d0c5af] max-w-xl mx-auto">
            Visit our flagship boutiques in DHA Lahore and Clifton Karachi for a private olfactory consultation.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffe088] transition-colors"
          >
            DISCOVER THE COLLECTION
          </button>
        </div>

      </div>
    </div>
  );
};
