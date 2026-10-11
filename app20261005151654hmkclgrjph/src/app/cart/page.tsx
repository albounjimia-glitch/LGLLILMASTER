'use client';

import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">{t('cart.empty')}</h1>
          <p className="text-gray-500 mb-8">{t('cart.startShopping')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#e94560] hover:bg-[#d63d56] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('cart.continueShopping')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">{t('cart.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.id}`}
                    className="font-semibold text-[#1a1a2e] hover:text-[#e94560] line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('cart.size')}: {item.size} | {t('cart.color')}: {item.color}
                  </p>
                  <p className="font-bold text-[#e94560] mt-1">
                    {item.product.price.toFixed(2)} MAD
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title={t('cart.remove')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-[#e94560] text-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-[#e94560] text-black"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">{t('cart.summary')}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal', { count: totalItems })}</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600">{t('cart.free')}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#e94560]">{totalPrice.toFixed(2)} MAD</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-[#e94560] hover:bg-[#d63d56] text-white text-center py-3 rounded-lg font-semibold transition-colors"
              >
                {t('cart.checkout')}
              </Link>
              <Link
                href="/"
                className="block w-full text-center py-3 text-gray-600 hover:text-[#e94560] font-medium mt-2"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
