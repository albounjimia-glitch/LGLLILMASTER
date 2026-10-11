'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Product } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        if (search) params.set('search', search);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to <span className="text-[#e94560]">LGLLILMASTER</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Premium Clothing - Hats, Watches, Hoodies, Pants & Jackets
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#products" className="bg-[#e94560] hover:bg-[#d63d56] text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Shop Now
              </a>
              <a href="/cart" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-colors border border-white/30">
                View Cart
              </a>
              <a href="/login" className="bg-white text-[#1a1a2e] hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors">
                Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="products" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter />
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {search ? `Search Results for "${search}"` : category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </h2>
            <span className="text-gray-500">{products.length} products</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-[#e94560]">LGLLIL</span>MASTER
              </h3>
              <p className="text-gray-400">
                Your destination for premium clothing and accessories.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/?category=hats" className="hover:text-white">Hats</a></li>
                <li><a href="/?category=watches" className="hover:text-white">Watches</a></li>
                <li><a href="/cart" className="hover:text-white">Cart</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: lgllilmaster999@gmail.com</li>
                <li>Phone: 0778593726</li>
                <li>Cash on Delivery Available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LGLLILMASTER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
