'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Package, MapPin, Heart, LogOut, Settings } from 'lucide-react';
import { useAuth, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

export default function AccountLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!token) router.push('/auth/login?next=' + pathname);
  }, [token, router, pathname]);

  if (!token) return null;

  const links = [
    { href: '/account',           label: t.account.profile,   icon: User },
    { href: '/account/orders',    label: t.account.myOrders,  icon: Package },
    { href: '/account/addresses', label: t.account.addresses, icon: MapPin },
    { href: '/wishlist',          label: t.nav.wishlist,      icon: Heart },
  ];

  return (
    <section className="container-app py-8">
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="card p-4 h-fit">
          <div className="flex items-center gap-3 pb-4 border-b mb-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-brand-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
          <nav className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition',
                  pathname === l.href ? 'bg-brand-50 text-brand-700 font-bold' : 'text-brand-800 hover:bg-brand-50'
                )}
              >
                <l.icon className="w-4 h-4" />{l.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-accent-600 hover:bg-accent-50 font-bold">
                <Settings className="w-4 h-4" />{t.nav.admin}
              </Link>
            )}
            <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" />{t.nav.logout}
            </button>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
