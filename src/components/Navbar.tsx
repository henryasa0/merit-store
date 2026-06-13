import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, User, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'wishlist' | 'admin', category?: string) => void;
  onSearch: (query: string) => void;
  activeView: string;
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onNavigate,
  onSearch,
  activeView
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigate('products');
  };

  const handleCategorySelect = (cat: string) => {
    onNavigate('products', cat);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Announcement Promo Bar */}
      <div className="bg-emerald-800 text-white text-center py-1.5 px-4 text-xs font-medium tracking-wide">
        🌿 100% ORGANIC BIOLOGICAL REMEDIES! The Authentic Strong Man Syrup is now back in stock. Pay on Delivery nationwide.
      </div>

      {/* Sticky Header Wrapper */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center space-x-2 cursor-pointer shrink-0"
              id="header_logo_container"
            >
              <div className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center text-white font-extrabold text-xl tracking-tight">
                M
              </div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900">
                Merit<span className="text-emerald-800 italic">.OnlineStore</span>
              </span>
            </div>

            {/* Live Search - Responsive Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
              <input
                type="text"
                placeholder="Search Strong Man Syrup, ingredients, dosage..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pl-11 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition-all text-gray-900"
                id="desktop_search_input"
              />
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bg-emerald-800 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-emerald-900 transition-colors"
                id="desktop_search_submit_btn"
              >
                Search
              </button>
            </form>

            {/* Utility Icons & Navigation links */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              <button
                onClick={() => onNavigate('products')}
                className={`text-sm font-semibold tracking-wide hidden lg:block transition ${
                  activeView === 'products' ? 'text-emerald-700' : 'text-gray-700 hover:text-emerald-700'
                }`}
                id="nav_all_products_link"
              >
                All Products
              </button>

              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition ${
                  activeView === 'admin' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                id="nav_admin_btn"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Portal Admin</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative p-2 text-gray-600 hover:text-emerald-700 transition"
                aria-label="Wishlist"
                id="nav_wishlist_icon_btn"
              >
                <Heart className={`w-6 h-6 ${activeView === 'wishlist' ? 'fill-current text-emerald-700' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-700 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-gray-600 hover:text-emerald-700 transition"
                aria-label="Shopping Cart"
                id="nav_cart_icon_btn"
              >
                <ShoppingBag className={`w-6 h-6 ${activeView === 'cart' ? 'text-emerald-700' : ''}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-700 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Icon */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-emerald-700 md:hidden"
                aria-label="Toggle Mobile Menu"
                id="nav_mobile_toggle_btn"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Search & Actions */}
        <div className="md:hidden border-t border-gray-100 bg-gray-50 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Strong Man Syrup..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-emerald-700 text-gray-900"
              id="mobile_search_input"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <button type="submit" className="absolute right-2 top-2 bg-emerald-800 text-white text-[10px] px-3 py-1 rounded-md font-medium">
              Go
            </button>
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 animate-fadeIn md:hidden">
            <div className="px-4 pt-3 pb-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Shop Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Herbal Syrup'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="text-left py-2 px-3 bg-gray-50 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-gray-800 transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <button
                  onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center bg-gray-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                >
                  Browse Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
