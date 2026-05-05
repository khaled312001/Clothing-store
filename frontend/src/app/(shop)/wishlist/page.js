'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth, useUI, useWishlist, useCart } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const { user } = useAuth();
  const wishlist = useWishlist();
  const cart = useCart();

  const [guestProducts, setGuestProducts] = useState([]);

  // Fetch products for guest wishlist using bulk endpoint
  useEffect(() => {
    if (!user && wishlist.productIds.length > 0) {
      api.get(`/products/by-ids?ids=${wishlist.productIds.join(',')}`)
        .then(d => setGuestProducts(d.products))
        .catch(() => setGuestProducts([]));
    } else {
      setGuestProducts([]);
    }
  }, [user, wishlist.productIds]);

  const items = user ? wishlist.items : guestProducts.map(p => ({
    id: p.id, product_id: p.id, slug: p.slug,
    name_ar: p.name_ar, name_en: p.name_en,
    price: p.price, compare_at_price: p.compare_at_price,
    image: p.image,
  }));

  if (items.length === 0) {
    return (
      <section className="container-app py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-brand-50 mx-auto flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-brand-300" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-2">
            {isAr ? 'مفضلتك فارغة' : 'Your wishlist is empty'}
          </h1>
          <p className="text-gray-500 mb-6">{isAr ? 'احفظ المنتجات اللي تعجبك هنا' : 'Save products you love here'}</p>
          <Link href="/" className="btn btn-primary btn-lg">{isAr ? 'تابع التسوق' : 'Continue shopping'}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-app py-8">
      <h1 className="text-3xl font-bold text-brand-900 mb-6">{t.nav.wishlist}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(it => (
          <div key={it.id} className="card overflow-hidden">
            <Link href={`/product/${it.slug}`} className="block relative aspect-[4/5] bg-gray-50">
              {it.image && <Image src={it.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />}
            </Link>
            <div className="p-3">
              <Link href={`/product/${it.slug}`} className="font-semibold text-sm text-brand-900 line-clamp-2 hover:text-brand-600">
                {isAr ? it.name_ar : it.name_en}
              </Link>
              <div className="font-bold text-brand-900 mt-2">{formatPrice(it.price, locale)}</div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => user ? wishlist.removeServer(it.product_id) : wishlist.toggleLocal(it.product_id)}
                  className="flex-1 btn btn-outline btn-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
