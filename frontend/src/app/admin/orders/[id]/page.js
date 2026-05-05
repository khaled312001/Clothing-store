'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Save, Printer } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const PAY_STATUSES = ['unpaid','paid','failed','refunded'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState({ status: '', payment_status: '', tracking_number: '' });

  const load = () => api.get(`/admin/orders/${id}`).then(d => {
    setData(d);
    setEdit({ status: d.order.status, payment_status: d.order.payment_status, tracking_number: d.order.tracking_number || '' });
  });
  useEffect(() => { load(); }, [id]);

  if (!data) return <div className="text-center py-12 text-gray-500">{isAr ? 'جاري التحميل…' : 'Loading…'}</div>;

  const { order, items } = data;

  const save = async () => {
    await api.put(`/admin/orders/${id}`, edit);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b">
          <div>
            <div className="text-xs text-gray-500">{isAr ? 'رقم الطلب' : 'Order #'}</div>
            <div className="font-bold text-2xl text-brand-900">{order.order_number}</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(order.created_at, locale)}</div>
          </div>
          <div className="text-end">
            <span className={cn('badge border text-sm px-3 py-1', STATUS_COLORS[order.status])}>{STATUS_LABELS[locale][order.status]}</span>
            <div className="text-2xl font-extrabold text-brand-900 mt-1">{formatPrice(order.total, locale)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="py-4 space-y-3">
          {items.map(it => (
            <div key={it.id} className="flex gap-3 text-sm border-b last:border-b-0 pb-3 last:pb-0">
              <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {it.image_url && <Image src={it.image_url} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-brand-900">{isAr ? it.product_name_ar : it.product_name_en}</div>
                <div className="text-xs text-gray-500 mt-0.5">{it.size} · {isAr ? it.color_name_ar : it.color_name_en} · ×{it.quantity}</div>
              </div>
              <div className="font-bold whitespace-nowrap">{formatPrice(it.subtotal, locale)}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h3 className="font-bold text-brand-900 text-sm mb-1">{isAr ? 'العميل' : 'Customer'}</h3>
            <div className="text-sm">{order.customer_name}</div>
            <div className="text-xs text-gray-500">{order.customer_email}</div>
            <div className="text-xs text-gray-500">{order.customer_phone}</div>
          </div>
          <div>
            <h3 className="font-bold text-brand-900 text-sm mb-1">{isAr ? 'عنوان الشحن' : 'Shipping address'}</h3>
            <div className="text-sm">{order.shipping_full_name}</div>
            <div className="text-xs text-gray-700">{order.shipping_phone}</div>
            <div className="text-xs text-gray-700">{order.shipping_governorate} · {order.shipping_city} · {order.shipping_street}</div>
          </div>
        </div>
      </div>

      {/* Update */}
      <div className="card p-6 grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-brand-700 mb-1 block uppercase">{isAr ? 'حالة الطلب' : 'Order status'}</label>
          <select className="input h-10" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[locale][s]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-brand-700 mb-1 block uppercase">{isAr ? 'حالة الدفع' : 'Payment status'}</label>
          <select className="input h-10" value={edit.payment_status} onChange={(e) => setEdit({ ...edit, payment_status: e.target.value })}>
            {PAY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-brand-700 mb-1 block uppercase">{isAr ? 'رقم التتبع' : 'Tracking #'}</label>
          <input className="input h-10" value={edit.tracking_number} onChange={(e) => setEdit({ ...edit, tracking_number: e.target.value })} />
        </div>
        <div className="sm:col-span-3 flex gap-2">
          <button onClick={save} className="btn btn-primary btn-md"><Save className="w-4 h-4" />{isAr ? 'حفظ' : 'Save'}</button>
          <Link href={`/admin/orders/${id}/invoice`} className="btn btn-outline btn-md"><Printer className="w-4 h-4" />{isAr ? 'طباعة الفاتورة' : 'Print invoice'}</Link>
        </div>
      </div>
    </div>
  );
}
