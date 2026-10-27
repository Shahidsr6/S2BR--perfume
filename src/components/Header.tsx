import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartCount, 
    wishlist, 
    setIsSearchOpen, 
    user, 
    logout,
    siteSettings,
    theme,
    toggleTheme
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: 'home' },
    { label: 'Shop', path: 'shop' },
    { label: 'Men', path: 'men' },
    { label: 'Women', path: 'women' },
    { label: 'Collections', path: 'collections' },
    { label: 'Best Sellers', path: 'best-sellers' },
    { label: 'About', path: 'about' },
    { label: 'Journal', path: 'blog' },
    { label: 'Contact', path: 'contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    navigateTo(path);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Announcement Bar */}
      {siteSettings.isAnnouncementActive && (
        <div className="bg-[#0f0e0d] text-[#f2ca50] py-2 px-4 sm:px-8 text-center font-label-caps text-[11px] border-b border-[#f2ca50]/20 tracking-widest uppercase flex items-center justify-center gap-2">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="h-20 bg-[#141312]/95 backdrop-blur-md border-b border-[#f2ca50]/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 mr-6 lg:mr-10 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left group pr-2"
            >
              <img 
                src="/public/assets/aistudio/Image_1_d38e84ab.jpeg" 
                alt="S2BR Logo Crest" 
                className="w-7 h-7 object-contain rounded-xs border border-[#f2ca50]/30 p-0.5 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-[15px] text-[#f2ca50] group-hover:text-[#ffe088] transition-colors tracking-wider uppercase font-bold leading-none">
                  S2BR
                </span>
                <span className="font-label-caps text-[8px] text-[#d0c5af] tracking-[0.25em] uppercase border-t border-[#f2ca50]/30 pt-0.5 mt-0.5 leading-none">
                  FRAGRANCES
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = currentPage === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`font-title-sc text-[12px] py-1 transition-all duration-200 tracking-widest relative ${
                    isActive
                      ? 'text-[#f2ca50] font-bold border-b border-[#f2ca50]'
                      : 'text-[#d0c5af] hover:text-[#f2ca50]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              className="text-[#d0c5af] hover:text-[#f2ca50] transition-all p-1.5 flex items-center justify-center rounded hover:bg-[#211f1e] group"
              aria-label={theme === 'dark' ? 'Switch to Daylight Atelier Mode' : 'Switch to Noir Evening Mode'}
              title={theme === 'dark' ? 'Switch to Daylight Atelier Mode' : 'Switch to Noir Evening Mode'}
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-45">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1.5 flex items-center justify-center rounded hover:bg-[#211f1e]"
              aria-label="Search Fragrances"
              title="Search Fragrance Vault"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => handleNavClick('account')}
              className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1.5 relative flex items-center justify-center rounded hover:bg-[#211f1e]"
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart / Fragrance Vault Link */}
            <button
              onClick={() => handleNavClick('cart')}
              className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1.5 relative flex items-center justify-center rounded hover:bg-[#211f1e]"
              aria-label="Shopping Cart"
              title="View Fragrance Vault"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 text-[#d0c5af] hover:text-[#f2ca50] p-1 rounded hover:bg-[#211f1e] transition-colors"
                aria-label="Customer Account"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                {user?.role === 'admin' && (
                  <span className="hidden sm:inline-block bg-[#745b00] text-[#f8d575] font-label-caps text-[9px] px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1d1b1a] border border-[#f2ca50]/30 shadow-2xl py-2 z-50 rounded-none">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#4d4635]/40">
                        <p className="font-title-sc text-[11px] text-[#f2ca50] truncate">{user.name}</p>
                        <p className="font-body-sm text-[11px] text-[#99907c] truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-4 py-2 text-[12px] text-[#e6e1df] hover:bg-[#2b2a28] hover:text-[#f2ca50] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        My Orders & Profile
                      </button>

                      <button
                        onClick={() => handleNavClick('track')}
                        className="w-full text-left px-4 py-2 text-[12px] text-[#e6e1df] hover:bg-[#2b2a28] hover:text-[#f2ca50] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        Track Pakistan Shipment
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-[12px] text-[#f2ca50] bg-[#745b00]/20 hover:bg-[#745b00]/40 flex items-center gap-2 font-semibold"
                        >
                          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                          Atelier Admin Portal
                        </button>
                      )}

                      <div className="border-t border-[#4d4635]/40 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setAccountDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[12px] text-red-400 hover:bg-[#2b2a28] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <p className="font-title-sc text-[11px] text-[#f2ca50] uppercase">Patron Access</p>
                        <p className="font-body-sm text-[11px] text-[#99907c] mt-0.5">Access order history & exclusive vault reserves.</p>
                      </div>
                      <div className="px-3 py-2 flex flex-col gap-1.5 border-t border-[#4d4635]/40">
                        <button
                          onClick={() => handleNavClick('auth')}
                          className="w-full py-2 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] tracking-wider text-center uppercase font-bold hover:bg-[#d4af37]"
                        >
                          Sign In / Register
                        </button>
                        <button
                          onClick={() => handleNavClick('track')}
                          className="w-full py-1.5 text-center text-[#d0c5af] hover:text-[#f2ca50] font-body-sm text-[11px]"
                        >
                          Track an Order
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141312] border-b border-[#f2ca50]/20 shadow-2xl px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left font-title-sc text-[13px] py-1.5 border-b border-[#211f1e] ${
                  currentPage === link.path ? 'text-[#f2ca50] font-bold' : 'text-[#d0c5af]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('track')}
              className="text-left font-title-sc text-[13px] py-1.5 text-[#d0c5af] border-b border-[#211f1e] flex items-center justify-between"
            >
              <span>Track Nationwide Order</span>
              <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">local_shipping</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left font-title-sc text-[13px] py-1.5 text-[#f2ca50] flex items-center justify-between border-b border-[#211f1e]"
            >
              <span>Admin Management Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            </button>

            {/* Mobile Theme Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <span className="font-title-sc text-[11px] text-[#d0c5af] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                <span>{theme === 'dark' ? 'Noir Evening Mode' : 'Daylight Atelier Mode'}</span>
              </span>
              <button
                onClick={toggleTheme}
                className="px-2.5 py-1 text-[10px] font-label-caps uppercase tracking-wider bg-[#211f1e] hover:bg-[#2b2a28] text-[#f2ca50] border border-[#f2ca50]/30 transition-colors flex items-center gap-1"
              >
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                <span className="material-symbols-outlined text-[13px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
