'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save, ImagePlus, X, Upload } from 'lucide-react';
import Image from 'next/image';

const categories = ['hats', 'watches', 'hoodies', 'pants', 'jackets'];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hats',
    sizes: '',
    colors: '',
    stock: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Convert to base64
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(imageData);
      }

      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
        images: uploadedImages,
        stock: parseInt(formData.stock),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error('Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to create product');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Add New Product</h1>
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
                placeholder="e.g., Classic Snapback Cap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (MAD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
                placeholder="100.00"
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
                placeholder="50"
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
              placeholder="Product description..."
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
                placeholder="S, M, L, XL"
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
                placeholder="Black, White, Navy"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#e94560] transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e94560] mb-2"></div>
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload images from your phone</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                  </>
                )}
              </label>
            </div>

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({uploadedImages.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d63d56] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Product'}
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
