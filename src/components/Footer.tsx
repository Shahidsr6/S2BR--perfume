import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    const added = StorageService.addSubscriber(newsletterEmail);
    setSubscribed(true);
    setNewsletterEmail('');
    showToast(added ? 'Welcome to the S2BR Private Circle. Check your inbox for 10% off.' : 'You are already registered in the S2BR Private Circle.');
  };

  return (
    <footer className="w-full bg-[#0f0e0d] border-t border-[#f2ca50]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/public/assets/aistudio/Image_1_d38e84ab.jpeg" 
                alt="S2BR Logo" 
                className="w-8 h-8 object-contain rounded-xs border border-[#f2ca50]/30"
              />
              <span className="font-headline-sm text-[20px] text-[#f2ca50] uppercase tracking-widest font-bold">
                S2BR Fragrances
              </span>
            </div>
            <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed">
              Artisanal luxury perfumery bridging oriental majesty with modern French olfactory mastery. Formulated with rare botanical extracts, pure oud, and long-lasting bespoke formulations for Pakistan’s true connoisseurs.
            </p>
            <div className="pt-2">
              <span className="font-label-caps text-[11px] text-[#e5c365] tracking-widest block">
                EST. KARACHI • LAHORE • ISLAMABAD
              </span>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-4">
            <h4 className="font-title-sc text-[12px] text-[#f2ca50] uppercase tracking-widest border-b border-[#f2ca50]/20 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 font-body-sm text-[13px] text-[#d0c5af]">
              <li>
                <button 
                  onClick={() => navigateTo('shop')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Luxury Extrait De Parfum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('collections')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Concentrated Pure Attars
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('collections')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Royal Dehn Al Oud
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('men')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Scents For Him
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('women')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Scents For Her
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('pdp', { productId: 'the-grand-discovery-wardrobe' })} 
                  className="hover:text-[#f2ca50] transition-colors text-left text-[#e5c365]"
                >
                  The Discovery Sampler Box
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-4">
            <h4 className="font-title-sc text-[12px] text-[#f2ca50] uppercase tracking-widest border-b border-[#f2ca50]/20 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2.5 font-body-sm text-[13px] text-[#d0c5af]">
              <li>
                <button 
                  onClick={() => navigateTo('track')} 
                  className="hover:text-[#f2ca50] transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">local_shipping</span>
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Nationwide Express Shipping
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  7-Day Seamless Exchange Protocol
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('contact')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('contact')} 
                  className="hover:text-[#f2ca50] transition-colors text-left"
                >
                  Contact Olfactory Specialists
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Concierge Column */}
          <div className="space-y-4">
            <h4 className="font-title-sc text-[12px] text-[#f2ca50] uppercase tracking-widest border-b border-[#f2ca50]/20 pb-2">
              VIP Concierge
            </h4>
            <p className="font-body-sm text-[12px] text-[#d0c5af]">
              Direct private consultations & WhatsApp corporate gifting assistance.
            </p>
            <div className="flex items-center gap-2 text-[#f2ca50] font-body-sm text-[13px]">
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <a 
                href="https://wa.me/923000077227" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:underline font-medium"
              >
                WhatsApp: +92 (300) 007-S2BR
              </a>
            </div>
            <div className="flex items-start gap-2 text-[#d0c5af] font-body-sm text-[12px]">
              <span className="material-symbols-outlined text-[18px] text-[#f2ca50] shrink-0 mt-0.5">store</span>
              <span>Flagship Boutiques: DHA Phase 6, Lahore & Clifton Block 4, Karachi</span>
            </div>

            {/* Newsletter Dispatch Input */}
            <div className="pt-2">
              <span className="font-label-caps text-[10px] text-[#e6e1df] mb-1.5 uppercase tracking-wider block">
                Private Circle Dispatch
              </span>
              <form onSubmit={handleSubscribe} className="flex bg-[#211f1e] border border-[#f2ca50]/30">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address..." 
                  className="bg-transparent px-3 py-2 text-[12px] font-body-sm text-[#e6e1df] focus:outline-none w-full"
                />
                <button 
                  type="submit" 
                  className="bg-[#f2ca50] text-[#3c2f00] px-4 font-label-caps text-[10px] font-bold hover:bg-[#ffe088] transition-colors shrink-0"
                >
                  JOIN
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-[#f2ca50] mt-1 block">
                  ✓ Invitation code reserved.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods & Legal Strip */}
        <div className="pt-6 border-t border-[#f2ca50]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[#d0c5af] font-label-caps text-[10px]">
            <span className="px-2.5 py-1 bg-[#211f1e] border border-[#4d4635]/40 text-[#f2ca50]">
              CASH ON DELIVERY (COD)
            </span>
            <span className="px-2.5 py-1 bg-[#211f1e] border border-[#4d4635]/40 text-[#e6e1df]">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-[#211f1e] border border-[#4d4635]/40 text-[#e6e1df]">
              MASTERCARD
            </span>
            <span className="px-2.5 py-1 bg-[#211f1e] border border-[#4d4635]/40 text-[#e6e1df]">
              PAYPAK
            </span>
            <span className="px-2.5 py-1 bg-[#211f1e] border border-[#4d4635]/40 text-[#e5c365]">
              RAAST INSTANT
            </span>
            <button
              onClick={() => navigateTo('admin')}
              className="px-2.5 py-1 bg-[#211f1e] hover:bg-[#f2ca50] text-[#f2ca50] hover:text-[#3c2f00] border border-[#f2ca50]/40 font-label-caps text-[10px] uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ml-1"
              title="Access Admin Management Portal"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              <span>ADMIN PANEL</span>
            </button>
          </div>

          <div className="text-[#99907c] font-body-sm text-[12px] text-center md:text-right">
            © 2026 S2BR Fragrances Private Limited. All Rights Reserved. Artisanal Haute Parfumerie.
          </div>
        </div>
      </div>
    </footer>
  );
};
