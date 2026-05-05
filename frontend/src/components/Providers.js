'use client';

import { useEffect } from 'react';
import { useUI, useAuth, useCart, useWishlist } from '@/lib/store';

export function Providers({ children }) {
  const { locale, setLocale } = useUI();
  const { token, refresh } = useAuth();
  const fetchCart = useCart((s) => s.fetchServer);
  const fetchWishlist = useWishlist((s) => s.fetchServer);

  useEffect(() => {
    // Sync html dir/lang with persisted locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  useEffect(() => {
    if (token) {
      refresh();
      fetchCart();
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return children;
}
