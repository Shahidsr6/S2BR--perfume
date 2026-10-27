import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');

  const products = useMemo(() => StorageService.getProducts(), [isSearchOpen]);

  const families = ['All', 'Royal Oud', 'French Floral', 'Woody Smoky', 'Sweet Amber', 'Oriental Spicy'];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesText = 
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes.top.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.notes.heart.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.notes.base.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily;

      return matchesText && matchesFamily;
    });
  }, [products, searchTerm, selectedFamily]);

  if (!isSearchOpen) return null;

  const handleSelect = (productId: string) => {
    setIsSearchOpen(false);
    navigateTo('pdp', { productId });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0f0e0d]/85 backdrop-blur-md flex items-start justify-center pt-20 px-4 sm:px-6"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="relative bg-[#1d1b1a] max-w-2xl w-full border border-[#f2ca50]/30 shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Input */}
        <div className="flex items-center justify-between pb-4 border-b border-[#4d4635]/40">
          <div className="flex items-center gap-3 flex-grow">
            <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">search</span>
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by perfume name, notes (oud, saffron, rose)..."
              className="bg-transparent font-headline-sm text-[18px] text-[#e6e1df] placeholder-[#99907c] focus:outline-none w-full"
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Olfactory Family Filter Quick Chips */}
        <div className="pt-3 pb-2 flex flex-wrap gap-2">
          {families.map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1 text-[11px] font-label-caps uppercase transition-all ${
                selectedFamily === fam
                  ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                  : 'bg-[#2b2a28] text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-[380px] overflow-y-auto space-y-2 pr-1">
          {filtered.length > 0 ? (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleSelect(prod.id)}
                className="flex items-center gap-4 p-3 bg-[#211f1e] hover:bg-[#2b2a28] border border-transparent hover:border-[#f2ca50]/30 transition-all cursor-pointer group"
              >
                <div className="w-14 h-16 bg-[#0f0e0d] shrink-0 overflow-hidden border border-[#4d4635]/20">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider">{prod.family}</span>
                    <span className="text-[#99907c] text-[10px]">•</span>
                    <span className="font-label-caps text-[10px] text-[#d0c5af] uppercase">{prod.gender}</span>
                  </div>
                  <h4 className="font-headline-sm text-[16px] text-[#e6e1df] group-hover:text-[#f2ca50] truncate">{prod.name}</h4>
                  <p className="font-body-sm text-[11px] text-[#99907c] truncate">{prod.notes.top.join(', ')}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label-price text-[15px] text-[#f2ca50] font-bold">
                    Rs. {prod.price.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-label-caps text-[#99907c] uppercase">View Vault</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#99907c] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#f2ca50]/40">search_off</span>
              <p className="font-headline-sm text-[18px] text-[#e6e1df]">No fragrances found</p>
              <p className="font-body-sm text-[13px]">
                No formulations matched "{searchTerm}". Try searching for 'Oud', 'Noir', or 'Rose'.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
