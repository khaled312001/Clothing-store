'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

// =============== AUTH ===============
export const useAuth = create(persist(
  (set, get) => ({
    token: null,
    user: null,
    setAuth: (token, user) => {
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('bmg_token', token);
        else localStorage.removeItem('bmg_token');
      }
      set({ token, user });
    },
    logout: () => {
      if (typeof window !== 'undefined') localStorage.removeItem('bmg_token');
      set({ token: null, user: null });
    },
    refresh: async () => {
      try {
        const { user } = await api.get('/auth/me');
        set({ user });
      } catch { get().logout(); }
    },
  }),
  { name: 'bmg-auth' }
));

// =============== CART (server-backed when logged in, local otherwise) ===============
export const useCart = create(persist(
  (set, get) => ({
    items: [], // local items (when guest)
    serverItems: [],
    subtotal: 0,
    count: 0,
    coupon: null,

    addLocal: (item) => {
      const items = [...get().items];
      const idx = items.findIndex(i => i.variant_id === item.variant_id);
      if (idx >= 0) items[idx].quantity += item.quantity;
      else items.push(item);
      set({ items });
      get().recalc();
    },
    removeLocal: (variant_id) => {
      set({ items: get().items.filter(i => i.variant_id !== variant_id) });
      get().recalc();
    },
    updateLocal: (variant_id, quantity) => {
      const items = get().items.map(i => i.variant_id === variant_id ? { ...i, quantity } : i);
      set({ items });
      get().recalc();
    },
    clearLocal: () => { set({ items: [], coupon: null }); get().recalc(); },
    setCoupon: (coupon) => set({ coupon }),
    recalc: () => {
      const items = get().items;
      const subtotal = items.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
      const count = items.reduce((s, it) => s + it.quantity, 0);
      set({ subtotal, count });
    },

    // server cart (logged-in users)
    fetchServer: async () => {
      try {
        const { items, subtotal, count } = await api.get('/cart');
        set({ serverItems: items, subtotal, count });
      } catch {}
    },
    addServer: async (variant_id, quantity = 1) => {
      await api.post('/cart', { variant_id, quantity });
      await get().fetchServer();
    },
    updateServer: async (id, quantity) => {
      await api.put(`/cart/${id}`, { quantity });
      await get().fetchServer();
    },
    removeServer: async (id) => {
      await api.del(`/cart/${id}`);
      await get().fetchServer();
    },
    clearServer: async () => {
      await api.del('/cart');
      await get().fetchServer();
    },
  }),
  {
    name: 'bmg-cart',
    partialize: (s) => ({ items: s.items, coupon: s.coupon }),
  }
));

// =============== WISHLIST (local-only for guests, server for users) ===============
export const useWishlist = create(persist(
  (set, get) => ({
    productIds: [],
    items: [],
    toggleLocal: (productId) => {
      const ids = get().productIds.includes(productId)
        ? get().productIds.filter(i => i !== productId)
        : [...get().productIds, productId];
      set({ productIds: ids });
    },
    fetchServer: async () => {
      try {
        const { items } = await api.get('/wishlist');
        set({ items, productIds: items.map(i => i.product_id) });
      } catch {}
    },
    addServer: async (product_id) => {
      await api.post('/wishlist', { product_id });
      await get().fetchServer();
    },
    removeServer: async (product_id) => {
      await api.del(`/wishlist/${product_id}`);
      await get().fetchServer();
    },
  }),
  { name: 'bmg-wishlist', partialize: (s) => ({ productIds: s.productIds }) }
));

// =============== UI (locale, drawer toggles) ===============
export const useUI = create(persist(
  (set) => ({
    locale: 'ar',
    setLocale: (locale) => {
      set({ locale });
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      }
    },
    cartOpen: false,
    setCartOpen: (cartOpen) => set({ cartOpen }),
    menuOpen: false,
    setMenuOpen: (menuOpen) => set({ menuOpen }),
  }),
  { name: 'bmg-ui', partialize: (s) => ({ locale: s.locale }) }
));
