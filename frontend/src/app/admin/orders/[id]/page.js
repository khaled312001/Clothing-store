'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Save, Printer, CheckCircle2, XCircle, ZoomIn, FileText, ExternalLink } from 'lucide-react';
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

  const approvePayment = async () => {
    await api.put(`/admin/orders/${id}`, { payment_status: 'paid', status: order.status === 'pending' ? 'confirmed' : order.status });
    load();
  };
  const rejectPayment = async () => {
    if (!confirm(isAr ? 'هل تأكد من رفض إيصال الدفع؟' : 'Reject payment proof?')) return;
    await api.put(`/admin/orders/${id}`, { payment_status: 'failed' });
    load();
  };

  const isElectronic = ['fawry','paymob','vodafone_cash','instapay','card'].includes(order.payment_method);
  const PAY_LOGOS = {
    cod: '/payments/cod.svg',
    card: '/payments/visa.svg',
    fawry: '/payments/fawry.svg',
    paymob: '/payments/paymob.svg',
    vodafone_cash: '/payments/vodafone-cash.svg',
    instapay: '/payments/instapay.svg',
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

      {/* Payment proof — for electronic methods */}
      {isElectronic && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg border p-1.5 h-10 flex items-center">
                <img src={PAY_LOGOS[order.payment_method]} alt="" className="h-7" />
              </div>
              <div>
                <h3 className="font-bold text-brand-900">{isAr ? 'إيصال الدفع' : 'Payment Proof'}</h3>
                <div className="text-xs text-gray-500">
                  {isAr ? 'الطريقة:' : 'Method:'} <strong className="uppercase">{order.payment_method}</strong>
                  {' · '}{isAr ? 'الحالة:' : 'Status:'}
                  <span className={cn('ms-1 badge', {
                    'bg-emerald-100 text-emerald-700': order.payment_status === 'paid',
                    'bg-amber-100 text-amber-700':    order.payment_status === 'unpaid',
                    'bg-red-100 text-red-700':        order.payment_status === 'failed',
                    'bg-gray-100 text-gray-600':      order.payment_status === 'refunded',
                  })}>{order.payment_status}</span>
                </div>
              </div>
            </div>
            {order.payment_status === 'unpaid' && order.payment_proof_url && (
              <div className="flex gap-2">
                <button onClick={approvePayment} className="btn btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />{isAr ? 'تأكيد الدفع' : 'Approve'}
                </button>
                <button onClick={rejectPayment} className="btn btn-outline btn-sm border-red-500 text-red-600 hover:bg-red-50">
                  <XCircle className="w-4 h-4" />{isAr ? 'رفض' : 'Reject'}
                </button>
              </div>
            )}
          </div>

          {order.payment_proof_url ? (
            <div className="grid md:grid-cols-[300px_1fr] gap-4">
              {/* Screenshot */}
              <a href={order.payment_proof_url} target="_blank" rel="noopener" className="block relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-500 transition">
                <img src={order.payment_proof_url} alt="Payment proof" className="w-full max-h-80 object-contain bg-gray-50" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="absolute top-2 end-2">
                  <span className="bg-brand-900/80 text-white text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />{isAr ? 'فتح' : 'Open'}
                  </span>
                </div>
              </a>
              {/* Details */}
              <div className="space-y-3">
                {order.payment_reference && (
                  <div>
                    <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
                      {isAr ? 'رقم العملية' : 'Reference'}
                    </div>
                    <div className="font-mono font-bold text-brand-900 bg-gray-50 border rounded-lg p-2.5" dir="ltr">{order.payment_reference}</div>
                  </div>
                )}
                {order.payment_notes && (
                  <div>
                    <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
                      {isAr ? 'ملاحظات العميل' : 'Customer notes'}
                    </div>
                    <div className="text-sm text-brand-800 bg-gray-50 border rounded-lg p-2.5">{order.payment_notes}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
                    {isAr ? 'المبلغ المتوقع' : 'Expected amount'}
                  </div>
                  <div className="text-2xl font-extrabold text-brand-900">{formatPrice(order.total, locale)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-amber-50 border border-amber-200 rounded-xl">
              <FileText className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <div className="text-sm font-bold text-amber-900">{isAr ? 'لم يتم رفع إيصال الدفع بعد' : 'Payment proof not uploaded yet'}</div>
              <div className="text-xs text-amber-700 mt-1">{isAr ? 'العميل لم يرفع صورة من تحويله بعد' : "The customer hasn't uploaded their transfer screenshot"}</div>
            </div>
          )}
        </div>
      )}

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
