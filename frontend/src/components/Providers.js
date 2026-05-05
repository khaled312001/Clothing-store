'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useUI, useAuth, useCart, useWishlist } from '@/lib/store';

export function Providers({ children }) {
  const { locale } = useUI();
  const { token, refresh } = useAuth();
  const localCartItems = useCart((s) => s.items);
  const localWishlistIds = useWishlist((s) => s.productIds);
  const fetchCart = useCart((s) => s.fetchServer);
  const fetchWishlist = useWishlist((s) => s.fetchServer);
  const clearLocal = useCart((s) => s.clearLocal);
  const mergedRef = useRef(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  useEffect(() => {
    if (!token) {
      mergedRef.current = false;
      return;
    }
    refresh();

    (async () => {
      // Merge guest cart into server (once per login)
      if (!mergedRef.current && localCartItems.length > 0) {
        try {
          await api.post('/cart/merge', {
            items: localCartItems.map(i => ({ variant_id: i.variant_id, quantity: i.quantity }))
          });
          clearLocal();
        } catch {}
      }
      // Merge guest wishlist
      if (!mergedRef.current && localWishlistIds.length > 0) {
        for (const pid of localWishlistIds) {
          try { await api.post('/wishlist', { product_id: pid }); } catch {}
        }
      }
      mergedRef.current = true;
      fetchCart();
      fetchWishlist();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return children;
}
