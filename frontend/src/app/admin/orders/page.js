'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';

const STATUSES = ['','pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

export default function AdminOrders() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [data, setData] = useState({ orders: [], pagination: { total: 0 } });
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');

  const load = () => {
    const params = new URLSearchParams({ limit: '50' });
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    api.get(`/admin/orders?${params}`).then(setData);
  };
  useEffect(() => { load(); }, [status]);

  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-wrap gap-2 items-center">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="relative flex-1 min-w-[200px]">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? 'ابحث برقم الطلب أو العميل…' : 'Search by order number or customer…'} className="input ps-10 h-10 w-full" />
        </form>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input h-10 w-auto">
          {STATUSES.map(s => <option key={s} value={s}>{s ? STATUS_LABELS[locale][s] : (isAr ? 'كل الحالات' : 'All statuses')}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b text-sm">
          <span className="font-bold text-brand-900">{data.pagination.total}</span>
          <span className="text-gray-500"> {isAr ? 'طلب' : 'orders'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الدفع' : 'Payment'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-bold text-brand-700 hover:underline">{o.order_number}</Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">{o.customer_name}</div>
                    <div className="text-xs text-gray-500">{o.customer_email}</div>
                  </td>
                  <td className="px-3 py-3 font-bold">{formatPrice(o.total, locale)}</td>
                  <td className="px-3 py-3 text-xs uppercase">{o.payment_method}</td>
                  <td className="px-3 py-3"><span className={cn('badge border', STATUS_COLORS[o.status])}>{STATUS_LABELS[locale][o.status]}</span></td>
                  <td className="px-3 py-3 text-xs text-gray-500">{formatDate(o.created_at, locale)}</td>
                </tr>
              ))}
              {data.orders.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">{isAr ? 'لا توجد طلبات' : 'No orders'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
