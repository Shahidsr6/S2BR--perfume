import React, { useState, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import { ProductGender, FragranceFamily } from '../types';

interface ShopPageProps {
  initialGender?: ProductGender;
  initialCategory?: string;
  initialTitle?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  initialGender, 
  initialCategory,
  initialTitle = "The Haute Parfumerie Vault" 
}) => {
  const products = useMemo(() => StorageService.getProducts(), []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedGender, setSelectedGender] = useState<string>(initialGender || 'All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories = ['All', 'Luxury Perfumes', 'Concentrated Attars', 'Oud Collection', 'Discovery Sets'];
  const genders = ['All', 'Men', 'Women', 'Unisex'];
  const families = ['All', 'Royal Oud', 'Oriental Spicy', 'Woody Smoky', 'French Floral', 'Sweet Amber', 'Leather & Tobacco'];

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchGender = selectedGender === 'All' || p.gender === selectedGender;
      const matchFam = selectedFamily === 'All' || p.family === selectedFamily;
      const matchPrice = p.price <= maxPrice;
      const matchSearch = !searchFilter.trim() || 
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.notes.top.some(n => n.toLowerCase().includes(searchFilter.toLowerCase()));

      return matchCat && matchGender && matchFam && matchPrice && matchSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, selectedCategory, selectedGender, selectedFamily, maxPrice, sortBy, searchFilter]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedGender('All');
    setSelectedFamily('All');
    setMaxPrice(10000);
    setSearchFilter('');
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedGender !== 'All' || 
    selectedFamily !== 'All' || 
    maxPrice < 10000 || 
    searchFilter.trim() !== '';

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-2 border-b border-[#f2ca50]/20 pb-8">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            Artisanal Reserve Catalogue
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl text-[#e6e1df] font-serif">
            {initialTitle}
          </h1>
          <p className="font-body-md text-[14px] text-[#d0c5af] max-w-xl mx-auto leading-relaxed">
            Every flacon is bottled in heavy crystalline flacons and macerated for minimum 45 days. Formulated for 16+ hours wear in Pakistan's climate.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1d1b1a] p-4 border border-[#4d4635]/30">
          
          {/* Search within vault */}
          <div className="relative flex-grow max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#99907c] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search formulations by name or notes..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0f0e0d] text-[#e6e1df] text-[12px] border border-[#4d4635]/30 focus:outline-none focus:border-[#f2ca50]"
            />
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#2b2a28] text-[#f2ca50] text-[11px] font-title-sc uppercase border border-[#f2ca50]/30"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Filters {hasActiveFilters && '(Active)'}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0f0e0d] text-[#e6e1df] px-3 py-1.5 text-[12px] font-body-sm border border-[#4d4635]/30 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
              >
                <option value="featured" className="bg-[#1d1b1a]">Featured Formulations</option>
                <option value="price-asc" className="bg-[#1d1b1a]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#1d1b1a]">Price: High to Low</option>
                <option value="rating" className="bg-[#1d1b1a]">Highest Rated</option>
                <option value="newest" className="bg-[#1d1b1a]">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filters Sidebar (3 cols) */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#1d1b1a] p-5 border border-[#4d4635]/30 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#4d4635]/30">
                <span className="font-title-sc text-[12px] text-[#f2ca50] uppercase font-bold">
                  Curate Filters
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-body-sm text-[11px] text-[#e5c365] hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-wider block">
                  Category
                </span>
                <div className="space-y-1 text-[13px] font-body-sm">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-[#f2ca50] transition-colors">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#f2ca50]"
                      />
                      <span className={selectedCategory === cat ? 'text-[#f2ca50] font-semibold' : 'text-[#d0c5af]'}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2 pt-2 border-t border-[#4d4635]/25">
                <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-wider block">
                  Target Connoisseur
                </span>
                <div className="space-y-1 text-[13px] font-body-sm">
                  {genders.map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-[#f2ca50] transition-colors">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === g}
                        onChange={() => setSelectedGender(g)}
                        className="accent-[#f2ca50]"
                      />
                      <span className={selectedGender === g ? 'text-[#f2ca50] font-semibold' : 'text-[#d0c5af]'}>
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Olfactory Family */}
              <div className="space-y-2 pt-2 border-t border-[#4d4635]/25">
                <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-wider block">
                  Olfactory Family
                </span>
                <div className="space-y-1 text-[13px] font-body-sm">
                  {families.map((fam) => (
                    <label key={fam} className="flex items-center gap-2 cursor-pointer hover:text-[#f2ca50] transition-colors">
                      <input
                        type="radio"
                        name="family"
                        checked={selectedFamily === fam}
                        onChange={() => setSelectedFamily(fam)}
                        className="accent-[#f2ca50]"
                      />
                      <span className={selectedFamily === fam ? 'text-[#f2ca50] font-semibold' : 'text-[#d0c5af]'}>
                        {fam}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-[#4d4635]/25">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[10px] text-[#e5c365] uppercase tracking-wider">
                    Max Price
                  </span>
                  <span className="font-label-price text-[13px] text-[#f2ca50] font-bold">
                    Rs. {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#f2ca50] cursor-pointer"
                />
              </div>

            </div>
          </aside>

          {/* Product Grid (9 cols) */}
          <main className="lg:col-span-9 space-y-4">
            
            <div className="flex items-center justify-between text-[12px] text-[#99907c] pb-2">
              <span>Showing <strong>{filteredAndSorted.length}</strong> artisanal creations</span>
              {hasActiveFilters && (
                <span className="text-[#f2ca50]">Filtered selection active</span>
              )}
            </div>

            {filteredAndSorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1d1b1a] p-12 text-center border border-[#4d4635]/30 space-y-4">
                <span className="material-symbols-outlined text-[40px] text-[#f2ca50]/40">search_off</span>
                <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif">No Fragrances Matched Filters</h3>
                <p className="font-body-sm text-[13px] text-[#99907c] max-w-sm mx-auto">
                  Try adjusting your price range or clearing family filters to explore the rest of the vault.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-bold tracking-wider hover:bg-[#ffe088]"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
