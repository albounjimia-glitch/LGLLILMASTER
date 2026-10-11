'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Search, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

const categories = [
  { key: 'category.all', value: 'all' },
  { key: 'category.hats', value: 'hats' },
  { key: 'category.watches', value: 'watches' },
  { key: 'category.hoodies', value: 'hoodies' },
  { key: 'category.pants', value: 'pants' },
  { key: 'category.jackets', value: 'jackets' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#1a1a2e]">LGLLIL</span>
            <span className="text-2xl font-bold text-[#e94560]">MASTER</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map(cat => (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/' : `/?category=${cat.value}`}
                className="text-gray-700 hover:text-[#e94560] font-medium transition-colors"
              >
                {t(cat.key)}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder={t('header.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={signOut}
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#e94560]"
                    title={t('header.signOut')}
                  >
                    <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                    <LogOut className="w-5 h-5" />
                  </button>
                ) : (
                  <Link href="/login" className="hidden md:block text-gray-700 hover:text-[#e94560]" title={t('header.login')}>
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </>
            )}
            <Link href="/admin" className="hidden md:block text-gray-700 hover:text-[#e94560]" title={t('header.admin')}>
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-[#e94560]">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e94560] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              {categories.map(cat => (
                <Link
                  key={cat.value}
                  href={cat.value === 'all' ? '/' : `/?category=${cat.value}`}
                  className="text-gray-700 hover:text-[#e94560] font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(cat.key)}
                </Link>
              ))}
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="text-left text-gray-700 hover:text-[#e94560] font-medium py-2"
                    >
                      {t('header.signOut')} ({user.email})
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-[#e94560] font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.login')}
                    </Link>
                  )}
                </>
              )}
              <Link
                href="/admin"
                className="text-gray-700 hover:text-[#e94560] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.admin')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
