'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ShieldCheck, ArrowLeft, ArrowRight, AlertCircle, KeyRound, BarChart3, Package, ScanLine } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/admin';
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const { setAuth, user, token } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged-in as admin, jump straight to dashboard
  useEffect(() => {
    if (token && user?.role === 'admin') router.replace(next);
  }, [token, user, router, next]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.user.role !== 'admin') {
        setError(isAr ? 'هذه الصفحة مخصصة للمسؤولين فقط.' : 'This page is for admins only.');
        setLoading(false);
        return;
      }
      setAuth(res.token, res.user);
      router.replace(next);
    } catch (e) {
      setError(e.message || (isAr ? 'فشل تسجيل الدخول' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-brand-950">
      {/* LEFT: Branded panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white p-12 flex-col justify-between">
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -end-32 w-96 h-96 bg-brand-700 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 -start-20 w-80 h-80 bg-accent-500 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo-mark.svg" alt="AURA" className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-extrabold text-xl tracking-tight">AURA</div>
              <div className="text-[10px] text-brand-300 tracking-[0.18em] font-bold mt-1">FASHION HOUSE</div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent-400/10 border border-accent-400/30 text-accent-300 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAr ? 'بوابة الإدارة الآمنة' : 'Secure Admin Portal'}
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              {isAr ? (
                <>
                  مرحباً بعودتك<br />
                  <span className="text-accent-400">إلى لوحة التحكم</span>
                </>
              ) : (
                <>
                  Welcome back to<br />
                  <span className="text-accent-400">your dashboard</span>
                </>
              )}
            </h1>
            <p className="text-brand-200 text-lg max-w-md leading-relaxed">
              {isAr
                ? 'تحكم في متجرك بالكامل من مكان واحد — منتجات، طلبات، تقارير، نقطة بيع، ومخزون.'
                : 'Run your entire store from one place — products, orders, reports, POS, and inventory.'}
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { Icon: BarChart3, label: isAr ? 'تقارير حية' : 'Live Reports' },
              { Icon: ScanLine,  label: isAr ? 'نقطة بيع' : 'POS System' },
              { Icon: Package,   label: isAr ? 'إدارة المخزون' : 'Inventory' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-3 text-center hover:bg-white/10 transition">
                <f.Icon className="w-5 h-5 text-accent-400 mx-auto mb-1.5" />
                <div className="text-xs font-semibold text-brand-100">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-brand-400">
          © 2026 AURA Fashion · {isAr ? 'تم التطوير بواسطة' : 'Built by'}{' '}
          <a href="https://barmagly.tech" target="_blank" rel="noopener" className="text-accent-400 hover:underline">
            شركة برمجلي · Barmagly
          </a>
        </div>
      </div>

      {/* RIGHT: Login form */}
      <div className="bg-white flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-6 start-6 text-sm text-brand-600 hover:text-brand-800 flex items-center gap-1 group">
          <Arrow className="w-4 h-4 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
          {isAr ? 'العودة للمتجر' : 'Back to store'}
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo-mark.svg" alt="AURA" className="w-12 h-12" />
            <div>
              <div className="font-extrabold text-xl tracking-tight text-brand-900">AURA</div>
              <div className="text-[10px] text-brand-500 tracking-[0.18em] font-bold mt-1">ADMIN</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAr ? 'دخول الإدارة' : 'Admin Login'}
            </div>
            <h2 className="text-3xl font-extrabold text-brand-900 mb-2 tracking-tight">
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isAr ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-700 block mb-1.5 uppercase tracking-wider">
                {isAr ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aura.com"
                  className="input ps-11 h-12 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert(isAr ? 'تواصل مع الـmaster admin' : 'Contact your master admin'); }} className="text-xs text-brand-600 hover:text-brand-800 hover:underline">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input ps-11 h-12 text-sm font-semibold"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-12 rounded-xl bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-800 hover:to-brand-950 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
                loading && 'animate-pulse'
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  {isAr ? 'دخول لوحة التحكم' : 'Sign in to Dashboard'}
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                {isAr ? 'حساب تجريبي' : 'Demo account'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => { setEmail('admin@barmagly.tech'); setPassword('Admin@12345'); }}
              className="w-full text-start bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-xl p-3 transition group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-brand-700 truncate">admin@barmagly.tech</div>
                  <div className="text-xs font-mono text-gray-500 truncate">Admin@12345</div>
                </div>
                <div className="text-[10px] font-bold text-brand-600 bg-white border border-brand-200 px-2 py-1 rounded group-hover:bg-brand-700 group-hover:text-white group-hover:border-brand-700 transition">
                  {isAr ? 'استخدم' : 'USE'}
                </div>
              </div>
            </button>
          </div>

          {/* Customer login redirect */}
          <div className="mt-6 text-center text-xs text-gray-500">
            {isAr ? 'عميل عادي؟' : 'Are you a customer?'}{' '}
            <Link href="/auth/login" className="text-brand-600 font-bold hover:underline">
              {isAr ? 'دخول العملاء' : 'Customer login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <Suspense><AdminLoginInner /></Suspense>;
}
