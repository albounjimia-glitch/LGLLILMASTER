'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart!');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/" className="text-[#e94560] hover:underline">
            Return to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#e94560] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to store
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={product.images?.[selectedImageIndex] || 'https://via.placeholder.com/600'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev === 0 ? product.images!.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label={t('product.previousImage')}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev === product.images!.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label={t('product.nextImage')}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {t('product.imageOf', { current: selectedImageIndex + 1, total: product.images.length })}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-[#e94560]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="inline-block bg-[#1a1a2e] text-white text-sm px-3 py-1 rounded-full mb-4 capitalize">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-[#e94560] mb-4">{product.price.toFixed(2)} MAD</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-black ${
                        selectedSize === size
                          ? 'border-[#e94560] bg-[#e94560] text-white'
                          : 'border-gray-300 hover:border-[#e94560]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-black ${
                        selectedColor === color
                          ? 'border-[#e94560] bg-[#e94560] text-white'
                          : 'border-gray-300 hover:border-[#e94560]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-[#e94560] text-black"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-[#e94560] text-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
                added
                  ? 'bg-green-600 text-white'
                  : product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#e94560] hover:bg-[#d63d56] text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
