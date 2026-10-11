'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-[#1a1a2e] text-white text-xs px-2 py-1 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#e94560]">{product.price.toFixed(2)} MAD</span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
