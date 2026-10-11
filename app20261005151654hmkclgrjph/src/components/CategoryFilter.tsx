'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const categories = [
  { key: 'category.all', value: 'all' },
  { key: 'category.hats', value: 'hats' },
  { key: 'category.watches', value: 'watches' },
  { key: 'category.hoodies', value: 'hoodies' },
  { key: 'category.pants', value: 'pants' },
  { key: 'category.jackets', value: 'jackets' },
];

export default function CategoryFilter() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map(cat => (
        <Link
          key={cat.value}
          href={cat.value === 'all' ? '/' : `/?category=${cat.value}`}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            currentCategory === cat.value
              ? 'bg-[#e94560] text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {t(cat.key)}
        </Link>
      ))}
    </div>
  );
}
