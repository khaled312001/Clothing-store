'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, Settings, LogOut, Home, ScanLine, BarChart3, Boxes } from 'lucide-react';
import { useAuth, useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const { locale } = useUI();
  const isAr = locale === 'ar';

  useEffect(() => {
    // Skip auth checks on the admin login page itself
    if (pathname === '/admin/login') return;
    if (!token) router.replace('/admin/login?next=' + encodeURIComponent(pathname));
    else if (user && user.role !== 'admin') router.replace('/');
  }, [token, user, router, pathname]);

  // The admin login page renders standalone — no sidebar/topbar
  if (pathname === '/admin/login') return children;

  // Wait until both token AND user are present and role is verified before rendering children.
  // This prevents child pages from firing /admin/* requests before auth is confirmed.
  if (!token) return null;
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
        <div className="text-sm text-brand-600 font-semibold">{isAr ? 'جاري التحقق…' : 'Verifying…'}</div>
      </div>
    </div>
  );
  if (user.role !== 'admin') return null;

  const links = [
    { href: '/admin',           label: isAr ? 'لوحة المعلومات' : 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pos',       label: isAr ? 'نقطة البيع POS' : 'POS', icon: ScanLine, highlight: true },
    { href: '/admin/reports',   label: isAr ? 'التقارير' : 'Reports',          icon: BarChart3 },
    { href: '/admin/orders',    label: isAr ? 'الطلبات' : 'Orders',            icon: ShoppingCart },
    { href: '/admin/products',  label: isAr ? 'المنتجات' : 'Products',         icon: Package },
    { href: '/admin/inventory', label: isAr ? 'المخزون' : 'Inventory',         icon: Boxes },
    { href: '/admin/customers', label: isAr ? 'العملاء' : 'Customers',         icon: Users },
    { href: '/admin/coupons',   label: isAr ? 'الكوبونات' : 'Coupons',         icon: Tag },
    { href: '/admin/reviews',   label: isAr ? 'التقييمات' : 'Reviews',         icon: Star },
    { href: '/admin/settings',  label: isAr ? 'الإعدادات' : 'Settings',         icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-950 text-brand-100 sticky top-0 h-screen overflow-y-auto hidden lg:block">
        <div className="p-5 border-b border-brand-800 flex items-center gap-2">
          <img src="/logo-mark.svg" alt="AURA" className="w-9 h-9" />
          <div>
            <div className="font-bold text-white text-sm">AURA Admin</div>
            <div className="text-xs text-brand-400">{isAr ? 'لوحة التحكم' : 'Dashboard'}</div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
                pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
                  ? 'bg-accent-400 text-brand-950 font-bold shadow-md'
                  : l.highlight
                    ? 'text-accent-300 hover:bg-brand-800 hover:text-accent-200 font-bold border border-accent-400/30'
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
              )}
            >
              <l.icon className="w-4 h-4" />{l.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 mt-auto border-t border-brand-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-200 hover:bg-brand-800 hover:text-white">
            <Home className="w-4 h-4" />{isAr ? 'العودة للمتجر' : 'Back to store'}
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />{isAr ? 'تسجيل خروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="font-bold text-brand-900 text-lg">
              {links.find(l => pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href)))?.label || 'Admin'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-sm text-brand-700 hidden sm:block">{user.name}</div>
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                {user.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
