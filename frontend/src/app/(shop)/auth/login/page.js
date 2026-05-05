'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, KeyRound } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/account';
  const { locale } = useUI();
  const t = getDictionary(locale);
  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      setAuth(token, user);
      router.push(user.role === 'admin' ? '/admin' : next);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <section className="container-app py-10">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-1 text-center">{t.auth.loginTitle}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {locale === 'ar' ? 'أدخل بياناتك للمتابعة' : 'Enter your credentials to continue'}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.email}</label>
            <div className="relative">
              <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input ps-10 h-11" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.password}</label>
            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input ps-10 h-11" />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}

          <button disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.auth.submitLogin}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {t.auth.noAccount} <Link href="/auth/register" className="text-brand-600 font-bold hover:underline">{t.nav.register}</Link>
        </div>

        <div className="mt-6 pt-6 border-t text-xs text-gray-500 text-center">
          <div className="font-semibold mb-1 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            {locale === 'ar' ? 'حسابات تجريبية:' : 'Demo accounts:'}
          </div>
          <div>Admin: <code className="bg-gray-100 px-1 py-0.5 rounded">admin@barmagly.tech</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">Admin@12345</code></div>
          <div>Customer: <code className="bg-gray-100 px-1 py-0.5 rounded">customer@example.com</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">Customer@123</code></div>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return <Suspense><LoginInner /></Suspense>;
}
