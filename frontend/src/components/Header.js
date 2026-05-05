'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X, Globe, ChevronDown, LogOut, Package, MapPin } from 'lucide-react';
import { useAuth, useCart, useUI, useWishlist } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { locale, setLocale } = useUI();
  const t = getDictionary(locale);
  const { user, logout } = useAuth();
  const cartCount = useCart((s) => s.count);
  const wishlistCount = useWishlist((s) => (user ? s.items.length : s.productIds.length));

  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLang = () => setLocale(locale === 'ar' ? 'en' : 'ar');

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  const navLinks = [
    { href: '/category/kids',  label: t.nav.kids },
    { href: '/category/women', label: t.nav.women },
    { href: '/category/men',   label: t.nav.men },
    { href: '/products?sort=newest&isNew=1',     label: t.nav.new },
    { href: '/products?sort=bestseller', label: t.nav.bestsellers },
    { href: '/products?sort=price-asc',  label: t.nav.sale },
  ];

  return (
    <header className={cn(
      'sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow',
      scrolled ? 'shadow-md' : 'shadow-sm'
    )}>
      {/* Top utility bar */}
      <div className="bg-brand-900 text-white text-xs">
        <div className="container-app flex items-center justify-between py-2">
          <span className="hidden sm:inline">
            {locale === 'ar' ? '🚚 شحن مجاني للطلبات فوق 1500 ج.م' : '🚚 Free shipping on orders over 1500 EGP'}
          </span>
          <span className="sm:hidden">
            {locale === 'ar' ? '🚚 شحن مجاني فوق 1500 ج.م' : '🚚 Free shipping over 1500'}
          </span>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hover:text-accent-300 transition">{t.nav.contact}</Link>
            <span className="opacity-30">|</span>
            <Link href="/faq" className="hover:text-accent-300 transition">{t.nav.faq}</Link>
            <span className="opacity-30">|</span>
            <button onClick={switchLang} className="flex items-center gap-1 hover:text-accent-300 transition">
              <Globe className="w-3.5 h-3.5" />
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-app py-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
            B
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-brand-900 text-lg leading-none">{t.site.name}</div>
            <div className="text-[10px] text-brand-500 font-medium leading-tight">BARMAGLY · FASHION</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="flex-1 max-w-2xl mx-2 sm:mx-4 hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.nav.search}
              className="input ps-10 pe-20 h-11 rounded-2xl"
            />
            <button type="submit" className="absolute top-1/2 -translate-y-1/2 end-1.5 btn btn-primary btn-sm h-8 px-4">
              {locale === 'ar' ? 'بحث' : 'Go'}
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2 ms-auto">
          <Link href="/wishlist" className="relative p-2 rounded-xl hover:bg-brand-50 transition" title={t.nav.wishlist}>
            <Heart className="w-6 h-6 text-brand-700" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 bg-accent-400 text-brand-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-brand-50 transition" title={t.nav.cart}>
            <ShoppingBag className="w-6 h-6 text-brand-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 bg-accent-400 text-brand-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
              className="flex items-center gap-1 p-2 rounded-xl hover:bg-brand-50 transition"
            >
              <User className="w-6 h-6 text-brand-700" />
              <ChevronDown className="w-4 h-4 text-brand-500 hidden sm:block" />
            </button>
            {accountOpen && (
              <div className="absolute top-full end-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b">
                      <div className="font-semibold text-sm text-brand-900">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <Link href="/account" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-sm"><User className="w-4 h-4" />{t.nav.account}</Link>
                    <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-sm"><Package className="w-4 h-4" />{t.nav.orders}</Link>
                    <Link href="/account/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-sm"><MapPin className="w-4 h-4" />{t.account.addresses}</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-sm text-accent-600 font-semibold border-t">
                        ⚙ {t.nav.admin}
                      </Link>
                    )}
                    <button onClick={() => { logout(); router.push('/'); }} className="w-full text-start flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 border-t">
                      <LogOut className="w-4 h-4" />{t.nav.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2 hover:bg-brand-50 text-sm">{t.nav.login}</Link>
                    <Link href="/auth/register" className="block px-4 py-2 hover:bg-brand-50 text-sm">{t.nav.register}</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-brand-50"
          >
            {mobileOpen ? <X className="w-6 h-6 text-brand-700" /> : <Menu className="w-6 h-6 text-brand-700" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={onSearch} className="md:hidden container-app pb-3">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.nav.search}
            className="input ps-10 h-11 rounded-2xl"
          />
        </div>
      </form>

      {/* Categories nav */}
      <nav className="hidden md:block bg-white border-t border-gray-100">
        <div className="container-app flex items-center gap-1 overflow-x-auto py-2">
          <Link href="/" className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-brand-50 text-brand-800 whitespace-nowrap">
            {t.nav.home}
          </Link>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-brand-50 text-brand-800 whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white animate-fade-in">
          <div className="container-app py-3 flex flex-col">
            <Link href="/" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-sm font-semibold rounded-lg hover:bg-brand-50">{t.nav.home}</Link>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-3 text-sm font-semibold rounded-lg hover:bg-brand-50">{l.label}</Link>
            ))}
            <div className="border-t my-2" />
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm hover:bg-brand-50 rounded-lg">{t.nav.contact}</Link>
            <Link href="/faq" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm hover:bg-brand-50 rounded-lg">{t.nav.faq}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
