'use client';

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.session === null) {
          // User needs to confirm email
          toast.success(t('signup.confirmation'));
        } else {
          toast.success(t('signup.success'));
        }
        router.push('/');
      }
    } catch {
      toast.error(t('signup.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1a1a2e]">{t('signup.title')}</h1>
              <p className="text-gray-500 mt-2">{t('signup.subtitle')}</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('signup.fullNamePlaceholder')}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('signup.email') || 'you@example.com'}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('signup.passwordPlaceholder')}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e94560] hover:bg-[#d63d56] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {t('signup.submit')}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6">
              {t('signup.hasAccount')}{' '}
              <Link href="/login" className="text-[#e94560] hover:underline font-medium">
                {t('signup.signin')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
