'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

type TranslationValues = Record<string, string | number>;

const translations: Record<Language, Record<string, string>> = {
  en: {
    'language.english': 'English',
    'language.arabic': 'العربية',
    'theme.label': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'header.search': 'Search products...',
    'header.login': 'Login',
    'header.signOut': 'Sign Out',
    'header.admin': 'Admin',
    'category.all': 'All',
    'category.hats': 'Hats',
    'category.watches': 'Watches',
    'category.hoodies': 'Hoodies',
    'category.pants': 'Pants',
    'category.jackets': 'Jackets',
    'home.welcome': 'Welcome to',
    'home.tagline': 'Premium Clothing - Hats, Watches, Hoodies, Pants & Jackets',
    'home.shopNow': 'Shop Now',
    'home.viewCart': 'View Cart',
    'home.login': 'Login',
    'home.searchResults': 'Search Results for "{search}"',
    'home.allProducts': 'All Products',
    'home.productCount': '{count} products',
    'home.noProducts': 'No products found',
    'home.quickLinks': 'Quick Links',
    'home.home': 'Home',
    'home.cart': 'Cart',
    'home.contact': 'Contact',
    'home.description': 'Your destination for premium clothing and accessories.',
    'home.email': 'Email: info@lgllilmaster.com',
    'home.phone': 'Phone: +1 234 567 890',
    'home.codAvailable': 'Cash on Delivery Available',
    'home.copyright': '© 2024 LGLLILMASTER. All rights reserved.',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.notFound': 'Product not found',
    'product.returnToStore': 'Return to store',
    'product.backToStore': 'Back to store',
    'product.previousImage': 'Previous image',
    'product.nextImage': 'Next image',
    'product.imageOf': '{current} of {total}',
    'product.size': 'Size',
    'product.color': 'Color',
    'product.quantity': 'Quantity',
    'product.available': 'available',
    'product.addedToCart': 'Added to Cart',
    'product.addToCart': 'Add to Cart',
    'cart.empty': 'Your cart is empty',
    'cart.startShopping': 'Start shopping to add items to your cart',
    'cart.continueShopping': 'Continue Shopping',
    'cart.title': 'Shopping Cart',
    'cart.size': 'Size',
    'cart.color': 'Color',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal ({count} items)',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove item',
    'checkout.title': 'Checkout',
    'checkout.backToCart': 'Back to cart',
    'checkout.empty': 'Your cart is empty',
    'checkout.deliveryInformation': 'Delivery Information',
    'checkout.fullName': 'Full Name *',
    'checkout.phone': 'Phone Number *',
    'checkout.emailOptional': 'Email (optional)',
    'checkout.address': 'Delivery Address *',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.cashOnDelivery': 'Cash on Delivery',
    'checkout.payWhenArrives': 'Pay when your order arrives',
    'checkout.placeOrder': 'Place Order - ${total}',
    'checkout.processing': 'Processing...',
    'checkout.orderConfirmed': 'Order Confirmed!',
    'checkout.thankYou': 'Thank you for your order. Your order ID is:',
    'checkout.estimatedDelivery': 'Estimated delivery: 3-5 business days',
    'checkout.exactAmount': 'Cash on Delivery payment method. Please have the exact amount ready when your order arrives.',
    'checkout.requiredFields': 'Please fill in all required fields',
    'checkout.orderFailed': 'Failed to place order. Please try again.',
    'checkout.orderSuccess': 'Order placed successfully!',
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Sign in to your account',
    'login.google': 'Continue with Google',
    'login.orEmail': 'or continue with email',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.emailPlaceholder': 'you@example.com',
    'login.passwordPlaceholder': 'Enter your password',
    'login.submit': 'Sign In',
    'login.noAccount': 'Do not have an account?',
    'login.signup': 'Sign up',
    'login.success': 'Login successful!',
    'login.failed': 'Login failed',
    'login.confirmationRequired': 'Please confirm your email before signing in.',
    'login.resend': 'Resend confirmation email',
    'login.resending': 'Sending...',
    'login.resendSuccess': 'Confirmation email sent. Check your inbox.',
    'login.resendFailed': 'Could not resend the confirmation email.',
    'signup.title': 'Create Account',
    'signup.subtitle': 'Join us today',
    'signup.fullName': 'Full Name',
    'signup.fullNamePlaceholder': 'John Doe',
    'signup.email': 'Email',
    'signup.password': 'Password',
    'signup.passwordPlaceholder': 'Create a password (min 6 characters)',
    'signup.submit': 'Create Account',
    'signup.hasAccount': 'Already have an account?',
    'signup.signin': 'Sign in',
    'signup.success': 'Account created successfully!',
    'signup.confirmation': 'Account created. Check your email to confirm it before signing in.',
    'signup.failed': 'Signup failed',
    'auth.callback.loading': 'Completing sign-in...',
    'auth.callback.failed': 'Sign-in could not be completed.',
  },
  ar: {
    'language.english': 'English',
    'language.arabic': 'العربية',
    'theme.label': 'المظهر',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    'header.search': 'ابحث عن المنتجات...',
    'header.login': 'تسجيل الدخول',
    'header.signOut': 'تسجيل الخروج',
    'header.admin': 'الإدارة',
    'category.all': 'الكل',
    'category.hats': 'القبعات',
    'category.watches': 'الساعات',
    'category.hoodies': 'السترات ذات القلنسوة',
    'category.pants': 'السراويل',
    'category.jackets': 'السترات',
    'home.welcome': 'مرحباً بك في',
    'home.tagline': 'ملابس مميزة - قبعات وساعات وسترات وسراويل',
    'home.shopNow': 'تسوق الآن',
    'home.viewCart': 'عرض السلة',
    'home.login': 'تسجيل الدخول',
    'home.searchResults': 'نتائج البحث عن "{search}"',
    'home.allProducts': 'كل المنتجات',
    'home.productCount': '{count} منتجات',
    'home.noProducts': 'لم يتم العثور على منتجات',
    'home.quickLinks': 'روابط سريعة',
    'home.home': 'الرئيسية',
    'home.cart': 'السلة',
    'home.contact': 'تواصل معنا',
    'home.description': 'وجهتك للملابس والإكسسوارات المميزة.',
    'home.email': 'البريد الإلكتروني: info@lgllilmaster.com',
    'home.phone': 'الهاتف: +1 234 567 890',
    'home.codAvailable': 'الدفع عند الاستلام متاح',
    'home.copyright': '© 2024 LGLLILMASTER. جميع الحقوق محفوظة.',
    'product.inStock': 'متوفر',
    'product.outOfStock': 'غير متوفر',
    'product.notFound': 'لم يتم العثور على المنتج',
    'product.returnToStore': 'العودة إلى المتجر',
    'product.backToStore': 'العودة إلى المتجر',
    'product.previousImage': 'الصورة السابقة',
    'product.nextImage': 'الصورة التالية',
    'product.imageOf': '{current} من {total}',
    'product.size': 'المقاس',
    'product.color': 'اللون',
    'product.quantity': 'الكمية',
    'product.available': 'متوفر',
    'product.addedToCart': 'تمت الإضافة إلى السلة',
    'product.addToCart': 'أضف إلى السلة',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.startShopping': 'ابدأ التسوق لإضافة منتجات إلى السلة',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.title': 'سلة التسوق',
    'cart.size': 'المقاس',
    'cart.color': 'اللون',
    'cart.summary': 'ملخص الطلب',
    'cart.subtotal': 'المجموع الفرعي ({count} منتجات)',
    'cart.shipping': 'الشحن',
    'cart.free': 'مجاني',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'المتابعة إلى الدفع',
    'cart.remove': 'حذف المنتج',
    'checkout.title': 'إتمام الطلب',
    'checkout.backToCart': 'العودة إلى السلة',
    'checkout.empty': 'سلة التسوق فارغة',
    'checkout.deliveryInformation': 'معلومات التوصيل',
    'checkout.fullName': 'الاسم الكامل *',
    'checkout.phone': 'رقم الهاتف *',
    'checkout.emailOptional': 'البريد الإلكتروني (اختياري)',
    'checkout.address': 'عنوان التوصيل *',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.cashOnDelivery': 'الدفع عند الاستلام',
    'checkout.payWhenArrives': 'ادفع عند وصول طلبك',
    'checkout.placeOrder': 'تأكيد الطلب - ${total}',
    'checkout.processing': 'جارٍ المعالجة...',
    'checkout.orderConfirmed': 'تم تأكيد الطلب!',
    'checkout.thankYou': 'شكراً لطلبك. رقم طلبك هو:',
    'checkout.estimatedDelivery': 'التوصيل المتوقع: من 3 إلى 5 أيام عمل',
    'checkout.exactAmount': 'طريقة الدفع عند الاستلام. يرجى تجهيز المبلغ بالضبط عند وصول طلبك.',
    'checkout.requiredFields': 'يرجى تعبئة جميع الحقول المطلوبة',
    'checkout.orderFailed': 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.',
    'checkout.orderSuccess': 'تم إرسال الطلب بنجاح!',
    'login.welcome': 'مرحباً بعودتك',
    'login.subtitle': 'سجل الدخول إلى حسابك',
    'login.google': 'المتابعة باستخدام Google',
    'login.orEmail': 'أو المتابعة بالبريد الإلكتروني',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.emailPlaceholder': 'you@example.com',
    'login.passwordPlaceholder': 'أدخل كلمة المرور',
    'login.submit': 'تسجيل الدخول',
    'login.noAccount': 'ليس لديك حساب؟',
    'login.signup': 'إنشاء حساب',
    'login.success': 'تم تسجيل الدخول بنجاح!',
    'login.failed': 'فشل تسجيل الدخول',
    'login.confirmationRequired': 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
    'login.resend': 'إعادة إرسال رسالة التأكيد',
    'login.resending': 'جارٍ الإرسال...',
    'login.resendSuccess': 'تم إرسال رسالة التأكيد. تحقق من بريدك الوارد.',
    'login.resendFailed': 'تعذر إعادة إرسال رسالة التأكيد.',
    'signup.title': 'إنشاء حساب',
    'signup.subtitle': 'انضم إلينا اليوم',
    'signup.fullName': 'الاسم الكامل',
    'signup.fullNamePlaceholder': 'أحمد محمد',
    'signup.email': 'البريد الإلكتروني',
    'signup.password': 'كلمة المرور',
    'signup.passwordPlaceholder': 'أنشئ كلمة مرور (6 أحرف على الأقل)',
    'signup.submit': 'إنشاء حساب',
    'signup.hasAccount': 'لديك حساب بالفعل؟',
    'signup.signin': 'تسجيل الدخول',
    'signup.success': 'تم إنشاء الحساب بنجاح!',
    'signup.confirmation': 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده قبل تسجيل الدخول.',
    'signup.failed': 'فشل إنشاء الحساب',
    'auth.callback.loading': 'جارٍ إكمال تسجيل الدخول...',
    'auth.callback.failed': 'تعذر إكمال تسجيل الدخول.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, values?: TranslationValues) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('lgllilmaster_language');
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      setLanguage(savedLanguage);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lgllilmaster_language', language);
  }, [initialized, language]);

  const toggleLanguage = () => {
    setLanguage(current => current === 'en' ? 'ar' : 'en');
  };

  const t = (key: string, values?: TranslationValues) => {
    let text = translations[language][key] ?? translations.en[key] ?? key;
    Object.entries(values ?? {}).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, String(value));
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
