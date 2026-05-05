'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft, ArrowRight, Phone, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { formatPrice, formatDate, STATUS_LABELS } from '@/lib/utils';

export default function CustomerInvoicePage() {
  const { id } = useParams();
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowRight : ArrowLeft;
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(setData).catch(() => {});
  }, [id]);

  if (!data) return <div className="text-center py-12">{isAr ? 'جاري التحميل…' : 'Loading…'}</div>;
  const { order, items } = data;

  return (
    <div className="container-app py-6 max-w-3xl">
      <div className="no-print mb-4 flex justify-between items-center">
        <Link href={`/account/orders/${id}`} className="text-brand-600 hover:underline flex items-center gap-1 text-sm">
          <Arrow className="w-4 h-4" />{isAr ? 'العودة للطلب' : 'Back to order'}
        </Link>
        <button onClick={() => window.print()} className="btn btn-primary btn-md">
          <Printer className="w-4 h-4" />{isAr ? 'طباعة الفاتورة' : 'Print invoice'}
        </button>
      </div>

      <div className="printable card p-8 border">
        <div className="flex items-start justify-between border-b pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-bold text-2xl flex items-center justify-center">B</div>
              <div>
                <div className="font-extrabold text-2xl text-brand-900 tracking-tight">AURA · أُورا</div>
                <div className="text-xs text-brand-500 tracking-[0.18em] font-bold mt-0.5">FASHION HOUSE</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +20 101 025 4819</div>
              <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> info@barmagly.tech</div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-xs text-gray-500 mb-1">{isAr ? 'فاتورة' : 'INVOICE'}</div>
            <div className="text-2xl font-extrabold text-brand-900 mb-1">{order.order_number}</div>
            <div className="text-xs text-gray-600">{formatDate(order.created_at, locale)}</div>
            <div className="mt-2 text-xs">
              <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">{STATUS_LABELS[locale][order.status]}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs font-bold text-brand-700 uppercase mb-2">{isAr ? 'الشحن إلى' : 'Ship to'}</div>
            <div className="font-bold text-brand-900">{order.shipping_full_name}</div>
            <div className="text-sm text-gray-700">{order.shipping_phone}</div>
            <div className="text-sm text-gray-700">{order.shipping_governorate} · {order.shipping_city}</div>
            <div className="text-sm text-gray-700">{order.shipping_street} {order.shipping_building && `· ${order.shipping_building}`}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-brand-700 uppercase mb-2">{isAr ? 'الدفع' : 'Payment'}</div>
            <div className="font-bold text-brand-900 uppercase">{order.payment_method}</div>
            <div className="text-sm text-gray-700">{isAr ? 'الحالة' : 'Status'}: {order.payment_status}</div>
            {order.tracking_number && <div className="text-sm text-gray-700 mt-1">{isAr ? 'رقم التتبع' : 'Tracking'}: <strong>{order.tracking_number}</strong></div>}
          </div>
        </div>

        <table className="w-full text-sm mb-6 border-y">
          <thead className="bg-gray-50 text-xs uppercase text-brand-700">
            <tr>
              <th className="text-start px-3 py-2">{isAr ? 'المنتج' : 'Item'}</th>
              <th className="text-start px-2 py-2">{isAr ? 'المقاس/اللون' : 'Size/Color'}</th>
              <th className="text-end px-2 py-2">{isAr ? 'السعر' : 'Price'}</th>
              <th className="text-end px-2 py-2">{isAr ? 'الكمية' : 'Qty'}</th>
              <th className="text-end px-3 py-2">{isAr ? 'المجموع' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">{isAr ? it.product_name_ar : it.product_name_en}</td>
                <td className="px-2 py-2 text-xs text-gray-600">{it.size} · {isAr ? it.color_name_ar : it.color_name_en}</td>
                <td className="px-2 py-2 text-end">{formatPrice(it.unit_price, locale)}</td>
                <td className="px-2 py-2 text-end">{it.quantity}</td>
                <td className="px-3 py-2 text-end font-bold">{formatPrice(it.subtotal, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span><strong>{formatPrice(order.subtotal, locale)}</strong></div>
            {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-600"><span>{isAr ? 'الخصم' : 'Discount'}</span><strong>-{formatPrice(order.discount, locale)}</strong></div>}
            <div className="flex justify-between"><span className="text-gray-600">{isAr ? 'الشحن' : 'Shipping'}</span><strong>{Number(order.shipping_fee) === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(order.shipping_fee, locale)}</strong></div>
            <div className="flex justify-between text-lg pt-2 border-t mt-2"><strong>{isAr ? 'الإجمالي' : 'Total'}</strong><strong>{formatPrice(order.total, locale)}</strong></div>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-4 text-center">
          {isAr ? 'شكراً لتسوقك من AURA — نتمنى أن تنال منتجاتنا إعجابك!' : 'Thank you for shopping with AURA — we hope you love your purchase!'}
        </div>
      </div>
    </div>
  );
}
