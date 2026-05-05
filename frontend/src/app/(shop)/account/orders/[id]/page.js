'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn, formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const [data, setData] = useState(null);
  const Arrow = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    api.get(`/orders/${id}`).then(setData).catch(() => {});
  }, [id]);

  if (!data) return <div className="text-center py-12 text-gray-500">{t.common.loading}</div>;

  const { order, items } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/account/orders" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
          <Arrow className="w-4 h-4" />{t.account.myOrders}
        </Link>
        <Link href={`/account/orders/${id}/invoice`} className="btn btn-outline btn-sm">
          <Printer className="w-4 h-4" />{isAr ? 'طباعة الفاتورة' : 'Print invoice'}
        </Link>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b">
          <div>
            <div className="text-xs text-gray-500">{t.checkout.orderNumber}</div>
            <div className="font-bold text-2xl text-brand-900">{order.order_number}</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(order.created_at, locale)}</div>
          </div>
          <div className="text-end">
            <div className={cn('badge border text-sm px-3 py-1', STATUS_COLORS[order.status])}>{STATUS_LABELS[locale][order.status]}</div>
            <div className="text-2xl font-extrabold text-brand-900 mt-1">{formatPrice(order.total, locale)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="py-4 space-y-3">
          {items.map(it => (
            <div key={it.id} className="flex gap-3 text-sm">
              <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {it.image_url && <Image src={it.image_url} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-brand-900">{isAr ? it.product_name_ar : it.product_name_en}</div>
                <div className="text-xs text-gray-500 mt-0.5">{it.size} · {isAr ? it.color_name_ar : it.color_name_en} · ×{it.quantity}</div>
              </div>
              <div className="font-bold whitespace-nowrap">{formatPrice(it.subtotal, locale)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">{t.cart.subtotal}</span><strong>{formatPrice(order.subtotal, locale)}</strong></div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-emerald-600"><span>{t.cart.discount}</span><strong>-{formatPrice(order.discount, locale)}</strong></div>
          )}
          <div className="flex justify-between"><span className="text-gray-600">{t.cart.shipping}</span><strong>{Number(order.shipping_fee) === 0 ? t.cart.freeShipping : formatPrice(order.shipping_fee, locale)}</strong></div>
          <div className="flex justify-between text-lg pt-2 border-t mt-2"><strong>{t.cart.total}</strong><strong>{formatPrice(order.total, locale)}</strong></div>
        </div>

        {/* Address */}
        <div className="border-t pt-4 mt-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-bold text-brand-900 mb-1">{t.checkout.shipping}</div>
            <div className="text-gray-700">{order.shipping_full_name}</div>
            <div className="text-gray-700">{order.shipping_phone}</div>
            <div className="text-gray-700">{order.shipping_governorate} · {order.shipping_city}</div>
            <div className="text-gray-700">{order.shipping_street} {order.shipping_building && `· ${order.shipping_building}`}</div>
          </div>
          <div>
            <div className="font-bold text-brand-900 mb-1">{t.checkout.payment}</div>
            <div className="text-gray-700">{t.checkout.methods[order.payment_method]}</div>
            <div className="text-xs text-gray-500 mt-1">{isAr ? 'حالة الدفع' : 'Payment status'}: {order.payment_status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
