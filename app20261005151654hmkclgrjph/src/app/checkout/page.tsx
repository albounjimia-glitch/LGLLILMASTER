'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
  });

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">{t('checkout.empty')}</h1>
          <Link href="/" className="text-[#e94560] hover:underline">
            {t('product.returnToStore')}
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">{t('checkout.orderConfirmed')}</h1>
            <p className="text-gray-600 mb-6">{t('checkout.thankYou')}</p>
            <p className="text-2xl font-bold text-[#e94560] mb-6">{orderId}</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-5 h-5" />
                <span>{t('checkout.estimatedDelivery')}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{t('checkout.exactAmount')}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#e94560] hover:bg-[#d63d56] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      toast.error(t('checkout.requiredFields'));
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: orderItems,
          subtotal: totalPrice,
          total: totalPrice,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const order = await res.json();
      setOrderId(order.id.slice(0, 8).toUpperCase());
      setOrderComplete(true);
      clearCart();
      toast.success(t('checkout.orderSuccess'));
    } catch (error) {
      toast.error(t('checkout.orderFailed'));
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-[#e94560] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('checkout.backToCart')}
        </Link>

        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">{t('checkout.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">{t('checkout.deliveryInformation')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                    placeholder={t('signup.fullNamePlaceholder')}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.emailOptional')}
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.address')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.customer_address}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                    placeholder="123 Main Street, City, State, ZIP Code"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">{t('checkout.paymentMethod')}</h2>
                <div className="bg-gray-50 border-2 border-[#e94560] rounded-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#e94560] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">COD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e]">{t('checkout.cashOnDelivery')}</p>
                    <p className="text-sm text-gray-500">{t('checkout.payWhenArrives')}</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-[#e94560] hover:bg-[#d63d56] text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('checkout.processing') : `${t('checkout.placeOrder').replace('${total}', totalPrice.toFixed(2) + ' MAD')}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">{t('cart.summary')}</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a2e] text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                      <p className="text-sm font-semibold text-[#e94560]">
                        {item.product.price.toFixed(2)} MAD x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal', { count: items.length })}</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#e94560]">{totalPrice.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
