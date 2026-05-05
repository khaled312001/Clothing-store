'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield, Minus, Plus, Check, CheckCircle2, AlertCircle, XCircle, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useCart, useUI, useWishlist } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn, formatPrice, discountPercent, formatDate } from '@/lib/utils';
import { ProductGrid } from '@/components/ProductGrid';
import { ReviewForm } from '@/components/ReviewForm';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const { user } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();

  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`).then(d => {
      setData(d);
      const sizes = [...new Set(d.product.variants.map(v => v.size))];
      const colors = [...new Map(d.product.variants.map(v => [v.color_name_en, v])).values()];
      setSize(sizes[0] || '');
      setColor(colors[0]?.color_name_en || '');
    }).catch(() => {});
  }, [slug]);

  if (!data) return <div className="container-app py-20 text-center text-gray-500">{t.common.loading}</div>;

  const { product, reviews, related } = data;
  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const sizes  = [...new Set(product.variants.map(v => v.size))];
  const colors = [...new Map(product.variants.map(v => [v.color_name_en, { ar: v.color_name_ar, en: v.color_name_en, hex: v.color_hex }])).values()];
  const variant = product.variants.find(v => v.size === size && v.color_name_en === color);
  const stock = variant?.stock ?? 0;
  const off = discountPercent(product.price, product.compare_at_price);
  const isWished = user
    ? wishlist.items?.some(i => i.product_id === product.id)
    : wishlist.productIds?.includes(product.id);

  const onAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      if (user) await cart.addServer(variant.id, qty);
      else cart.addLocal({
        variant_id: variant.id, product_id: product.id,
        slug: product.slug, name_ar: product.name_ar, name_en: product.name_en,
        price: Number(product.price), image: product.image,
        size: variant.size, color_name_ar: variant.color_name_ar, color_name_en: variant.color_name_en, color_hex: variant.color_hex,
        quantity: qty,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally { setAdding(false); }
  };

  const onBuyNow = async () => {
    await onAdd();
    router.push('/cart');
  };

  const onWish = () => {
    if (user) isWished ? wishlist.removeServer(product.id) : wishlist.addServer(product.id);
    else wishlist.toggleLocal(product.id);
  };

  // JSON-LD product schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand || 'AURA' },
    image: product.images.map(i => i.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: Number(product.price),
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(Number(product.rating_avg) > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating_avg).toFixed(1),
        reviewCount: product.rating_count,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-app py-6">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-700">{t.nav.home}</Link>
          <span>/</span>
          <Link href={`/category/${product.category_slug}`} className="hover:text-brand-700">
            {isAr ? product.category_name_ar : product.category_name_en}
          </Link>
          <span>/</span>
          <span className="text-brand-900 truncate max-w-xs">{name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden">
              {product.images[activeImg]?.url && (
                <Image
                  src={product.images[activeImg].url}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              {off > 0 && (
                <span className="absolute top-4 start-4 badge bg-red-500 text-white text-sm px-3 py-1">-{off}%</span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'relative aspect-square rounded-xl overflow-hidden border-2 transition',
                    activeImg === i ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="20vw" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {product.brand && (
              <div className="text-xs uppercase tracking-wider text-brand-500 font-bold mb-2">{product.brand}</div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-3">{name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={cn('w-4 h-4', i <= Math.round(product.rating_avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {Number(product.rating_avg).toFixed(1)} · {product.rating_count} {isAr ? 'تقييم' : 'reviews'}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">{t.product.sku}: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-brand-900">{formatPrice(product.price, locale)}</span>
              {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_at_price, locale)}</span>
                  <span className="badge bg-emerald-100 text-emerald-700">{t.product.save} {formatPrice(product.compare_at_price - product.price, locale)}</span>
                </>
              )}
            </div>

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-5">
                <div className="text-sm font-semibold text-brand-800 mb-2">
                  {t.product.color}: <span className="font-normal text-brand-600">{isAr ? colors.find(c => c.en === color)?.ar : color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c.en}
                      onClick={() => setColor(c.en)}
                      title={isAr ? c.ar : c.en}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 transition relative',
                        color === c.en ? 'border-brand-700 ring-2 ring-brand-200' : 'border-gray-200 hover:border-brand-400'
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.en && <Check className="w-4 h-4 text-white absolute inset-0 m-auto mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="text-sm font-semibold text-brand-800 mb-2">{t.product.size}: <span className="font-normal text-brand-600">{size}</span></div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => {
                    const inStock = product.variants.some(v => v.size === s && v.color_name_en === color && v.stock > 0);
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        disabled={!inStock}
                        className={cn(
                          'min-w-[3rem] px-3 py-2 text-sm rounded-lg border transition font-semibold',
                          size === s ? 'border-brand-700 bg-brand-700 text-white'
                                     : inStock ? 'border-gray-300 hover:border-brand-400' : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="text-sm mb-5 flex items-center gap-1.5">
              {stock > 5 ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-emerald-600 font-semibold">{t.product.inStock}</span></>
                : stock > 0 ? <><Zap className="w-4 h-4 text-amber-600" /><span className="text-amber-600 font-semibold">{t.product.lowStock} ({stock})</span></>
                : <><XCircle className="w-4 h-4 text-red-600" /><span className="text-red-600 font-semibold">{t.product.outOfStock}</span></>}
            </div>

            {/* Quantity & Buttons */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-brand-50"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(stock, qty + 1))} disabled={qty >= stock} className="p-2.5 hover:bg-brand-50 disabled:opacity-40"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={onAdd} disabled={stock < 1 || adding} className="btn btn-primary btn-lg flex-1">
                {added ? <><Check className="w-5 h-5" />{isAr ? 'تمت الإضافة' : 'Added'}</> : <><ShoppingBag className="w-5 h-5" />{t.product.addToCart}</>}
              </button>
              <button onClick={onWish} className={cn('p-3.5 rounded-xl border-2 transition', isWished ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-400 hover:text-red-500')}>
                <Heart className={cn('w-5 h-5', isWished && 'fill-current')} />
              </button>
            </div>
            <button onClick={onBuyNow} disabled={stock < 1} className="btn btn-accent btn-lg w-full">
              {t.product.buyNow}
            </button>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t">
              {[
                { icon: Truck, label: t.features.shipping.title },
                { icon: RotateCcw, label: t.features.returns.title },
                { icon: Shield, label: t.features.payment.title },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-6 h-6 mx-auto text-brand-600 mb-1" />
                  <div className="text-xs text-brand-700 font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-t pt-8">
          <div className="flex gap-1 border-b mb-6">
            {['description','specs','reviews'].map(k => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  'px-5 py-3 font-semibold text-sm transition border-b-2 -mb-px',
                  tab === k ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-brand-700'
                )}
              >
                {t.product[k]}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="prose max-w-none text-brand-800 leading-relaxed">
              <p>{desc}</p>
            </div>
          )}

          {tab === 'specs' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card p-4 flex justify-between"><span className="text-gray-500">{t.product.brand}</span><span className="font-semibold">{product.brand || '—'}</span></div>
              <div className="card p-4 flex justify-between"><span className="text-gray-500">{t.product.material}</span><span className="font-semibold">{isAr ? product.material_ar : product.material_en}</span></div>
              <div className="card p-4 flex justify-between"><span className="text-gray-500">{t.product.sku}</span><span className="font-semibold">{product.sku}</span></div>
              <div className="card p-4 flex justify-between"><span className="text-gray-500">{isAr ? 'القسم' : 'Category'}</span><span className="font-semibold">{isAr ? product.category_name_ar : product.category_name_en}</span></div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-4">
              <ReviewForm productId={product.id} onSubmitted={() => api.get(`/products/${slug}`).then(setData)} />
              {reviews.length === 0 && <div className="text-center text-gray-500 py-8">{isAr ? 'لا توجد تقييمات بعد — كن أول من يقيّم!' : 'No reviews yet — be the first to review!'}</div>}
              {reviews.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                        {r.user_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{r.user_name}</div>
                        <div className="text-xs text-gray-500">{formatDate(r.created_at, locale)}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={cn('w-4 h-4', i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                      ))}
                    </div>
                  </div>
                  {r.title && <h4 className="font-bold text-brand-900 mb-1">{r.title}</h4>}
                  <p className="text-sm text-brand-800 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-app py-8 lg:py-12">
          <h2 className="text-2xl font-bold text-brand-900 mb-6">{t.product.relatedProducts}</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
