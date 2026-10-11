'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#e94560] dark:text-gray-200 dark:hover:bg-gray-800"
      aria-label={language === 'en' ? t('language.arabic') : t('language.english')}
      title={language === 'en' ? t('language.arabic') : t('language.english')}
    >
      <Languages className="h-5 w-5" />
      <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
