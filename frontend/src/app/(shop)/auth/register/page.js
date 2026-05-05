'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const { setAuth } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.post('/auth/register', form);
      setAuth(token, user);
      router.push('/account');
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <section className="container-app py-10">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-1 text-center">{t.auth.registerTitle}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {locale === 'ar' ? 'انضم إلى عائلة AURA' : 'Join the AURA family'}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.name}</label>
            <div className="relative">
              <User className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="input ps-10 h-11" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.email}</label>
            <div className="relative">
              <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input ps-10 h-11" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.phone}</label>
            <div className="relative">
              <Phone className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input ps-10 h-11" placeholder="+201xxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.password}</label>
            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input required type="password" minLength="6" value={form.password} onChange={(e) => update('password', e.target.value)} className="input ps-10 h-11" />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}

          <button disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.auth.submitRegister}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {t.auth.haveAccount} <Link href="/auth/login" className="text-brand-600 font-bold hover:underline">{t.nav.login}</Link>
        </div>
      </div>
    </section>
  );
}
