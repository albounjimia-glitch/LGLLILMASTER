'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { Product } from '@/types';

const categories = ['hats', 'watches', 'hoodies', 'pants', 'jackets'];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hats',
    sizes: '',
    colors: '',
    images: '',
    stock: '',
    is_active: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error('Product not found');
        const product: Product = await res.json();

        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category: product.category,
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).join(', '),
          images: (product.images || []).join(', '),
          stock: product.stock.toString(),
          is_active: product.is_active,
        });
      } catch (error) {
        toast.error('Failed to load product');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
        images: formData.images ? formData.images.split(',').map(i => i.trim()) : [],
        stock: parseInt(formData.stock),
        is_active: formData.is_active,
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      toast.success('Product updated successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e94560]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colors (comma-separated)
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-[#e94560] border-gray-300 rounded focus:ring-[#e94560]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Product is active and visible in store
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d63d56] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Update Product'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 text-gray-600 hover:text-white font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
