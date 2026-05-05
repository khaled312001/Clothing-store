'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth, useCart, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const { user } = useAuth();
  const cart = useCart();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const items = user ? cart.serverItems : cart.items;
  const subtotal = (user ? cart.subtotal : cart.subtotal) || 0;
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  const applyCoupon = async () => {
    setCouponMsg('');
    try {
      const { coupon: c } = await api.post('/coupons/validate', { code: coupon, subtotal });
      cart.setCoupon(c);
      setCouponMsg({ ok: true, text: `${t.cart.couponApplied}: -${formatPrice(c.discount, locale)}` });
    } catch (e) {
      setCouponMsg({ ok: false, text: e.message });
    }
  };

  const onUpdate = (item, qty) => {
    if (user) cart.updateServer(item.id, qty);
    else cart.updateLocal(item.variant_id, qty);
  };
  const onRemove = (item) => {
    if (user) cart.removeServer(item.id);
    else cart.removeLocal(item.variant_id);
  };

  const discount = cart.coupon?.discount || 0;
  const FREE_THRESHOLD = 1500;
  const baseShipping = 60;
  const shipping = items.length === 0 ? 0 : (subtotal - discount >= FREE_THRESHOLD ? 0 : baseShipping);
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <section className="container-app py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-brand-50 mx-auto flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-brand-300" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-2">{t.cart.empty}</h1>
          <p className="text-gray-500 mb-6">{t.cart.emptyDesc}</p>
          <Link href="/" className="btn btn-primary btn-lg">{t.cart.continueShopping} <Arrow className="w-5 h-5" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-app py-8">
      <h1 className="text-3xl font-bold text-brand-900 mb-6">{t.cart.title} <span className="text-base text-gray-500 font-normal">({items.length} {t.cart.items})</span></h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id || it.variant_id} className="card p-4 flex gap-4">
              <Link href={`/product/${it.slug}`} className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                {it.image && <Image src={it.image} alt="" fill sizes="120px" className="object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${it.slug}`} className="font-bold text-brand-900 hover:text-brand-600 line-clamp-2">
                  {isAr ? it.name_ar : it.name_en}
                </Link>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    {t.product.color}:
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: it.color_hex }} />
                    {isAr ? it.color_name_ar : it.color_name_en}
                  </span>
                  <span>·</span>
                  <span>{t.product.size}: <strong>{it.size}</strong></span>
                </div>
                <div className="flex items-end justify-between gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => it.quantity > 1 && onUpdate(it, it.quantity - 1)} className="px-2.5 py-1.5 hover:bg-brand-50"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 font-bold text-sm">{it.quantity}</span>
                    <button onClick={() => onUpdate(it, it.quantity + 1)} className="px-2.5 py-1.5 hover:bg-brand-50"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="text-end">
                    <div className="font-bold text-brand-900">{formatPrice(Number(it.price) * it.quantity, locale)}</div>
                    {it.quantity > 1 && <div className="text-xs text-gray-500">{formatPrice(it.price, locale)} × {it.quantity}</div>}
                  </div>
                  <button onClick={() => onRemove(it)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title={t.cart.remove}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="card p-6 h-fit lg:sticky lg:top-44 space-y-4">
          <h2 className="font-bold text-brand-900 text-lg pb-3 border-b">{isAr ? 'ملخص الطلب' : 'Order Summary'}</h2>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder={t.cart.coupon}
                className="input ps-10 h-10 text-sm"
              />
            </div>
            <button onClick={applyCoupon} className="btn btn-outline btn-sm h-10">{t.cart.applyCoupon}</button>
          </div>
          {couponMsg && (
            <div className={`text-xs flex items-center gap-1.5 ${couponMsg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
              {couponMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {couponMsg.text}
            </div>
          )}

          <div className="space-y-2 text-sm pb-3 border-b">
            <div className="flex justify-between"><span className="text-gray-600">{t.cart.subtotal}</span><strong>{formatPrice(subtotal, locale)}</strong></div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>{t.cart.discount}</span><strong>-{formatPrice(discount, locale)}</strong></div>
            )}
            <div className="flex justify-between"><span className="text-gray-600">{t.cart.shipping}</span>
              <strong>{shipping === 0 ? <span className="text-emerald-600">{t.cart.freeShipping}</span> : formatPrice(shipping, locale)}</strong>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="font-bold text-brand-900">{t.cart.total}</span>
            <span className="text-2xl font-extrabold text-brand-900">{formatPrice(total, locale)}</span>
          </div>

          <Link href="/checkout" className="btn btn-primary btn-lg w-full">
            {t.cart.checkout} <Arrow className="w-5 h-5" />
          </Link>
          <Link href="/" className="btn btn-ghost btn-md w-full">
            {t.cart.continueShopping}
          </Link>
        </aside>
      </div>
    </section>
  );
}
