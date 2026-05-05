'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useUI, useWishlist, useCart, useAuth } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn, formatPrice, discountPercent } from '@/lib/utils';

export function ProductCard({ product }) {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const { user } = useAuth();
  const wishlist = useWishlist();
  const cart = useCart();

  const isAr = locale === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const isWished = user
    ? wishlist.items?.some(i => i.product_id === product.id)
    : wishlist.productIds?.includes(product.id);
  const off = discountPercent(product.price, product.compare_at_price);

  const onWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      isWished ? wishlist.removeServer(product.id) : wishlist.addServer(product.id);
    } else {
      wishlist.toggleLocal(product.id);
    }
  };

  const onQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const v = product.variants?.[0];
    if (!v) return;
    if (user) cart.addServer(v.id, 1);
    else cart.addLocal({
      variant_id: v.id,
      product_id: product.id,
      slug: product.slug,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: Number(product.price),
      image: product.image,
      size: v.size,
      color_name_ar: v.color_name_ar,
      color_name_en: v.color_name_en,
      color_hex: v.color_hex,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group card overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        {product.image && (
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="badge bg-red-500 text-white">
              -{off}%
            </span>
          )}
          {product.is_new ? (
            <span className="badge bg-emerald-500 text-white">{isAr ? 'جديد' : 'NEW'}</span>
          ) : null}
          {product.is_featured ? (
            <span className="badge bg-accent-400 text-brand-950">{isAr ? 'مميز' : 'TOP'}</span>
          ) : null}
        </div>

        {/* Wishlist */}
        <button
          onClick={onWish}
          className={cn(
            'absolute top-3 end-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition',
            isWished ? 'text-red-500' : 'text-brand-700 hover:text-red-500'
          )}
          aria-label="wishlist"
        >
          <Heart className={cn('w-4 h-4', isWished && 'fill-current')} />
        </button>

        {/* Hover Quick add */}
        {product.in_stock !== false && (
          <button
            onClick={onQuickAdd}
            className="absolute bottom-0 inset-x-0 bg-brand-900/95 text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            {t.product.addToCart}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        {product.brand && (
          <div className="text-[11px] uppercase tracking-wider text-brand-500 font-semibold mb-1">
            {product.brand}
          </div>
        )}
        <h3 className="text-sm font-semibold text-brand-900 line-clamp-2 group-hover:text-brand-600 transition mb-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Rating */}
        {Number(product.rating_avg) > 0 && (
          <div className="flex items-center gap-1 mb-2 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-brand-800">{Number(product.rating_avg).toFixed(1)}</span>
            <span className="text-gray-400">({product.rating_count || 0})</span>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name_en}
                title={isAr ? c.name_ar : c.name_en}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[11px] text-gray-500">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-900">
            {formatPrice(product.price, locale)}
          </span>
          {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compare_at_price, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
