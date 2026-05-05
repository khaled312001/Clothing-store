'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCustomers() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [data, setData] = useState({ customers: [], pagination: { total: 0 } });
  const [q, setQ] = useState('');

  const load = (search = '') => {
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('q', search);
    api.get(`/admin/customers?${params}`).then(setData);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => { e.preventDefault(); load(q); }} className="card p-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? 'ابحث بالاسم، الإيميل، أو التليفون…' : 'Search by name, email, phone…'} className="input ps-10 h-10" />
        </div>
        <button className="btn btn-primary btn-md">{isAr ? 'بحث' : 'Search'}</button>
      </form>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b text-sm">
          <span className="font-bold text-brand-900">{data.pagination.total}</span>
          <span className="text-gray-500"> {isAr ? 'عميل' : 'customers'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{isAr ? 'الاسم' : 'Name'}</th>
                <th className="text-start px-3 py-3">Email</th>
                <th className="text-start px-3 py-3">{isAr ? 'الهاتف' : 'Phone'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الطلبات' : 'Orders'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'تاريخ التسجيل' : 'Joined'}</th>
              </tr>
            </thead>
            <tbody>
              {data.customers.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">{c.name?.charAt(0)}</div>
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs">{c.email}</td>
                  <td className="px-3 py-3 text-xs" dir="ltr">{c.phone}</td>
                  <td className="px-3 py-3 font-bold">{c.orders_count}</td>
                  <td className="px-3 py-3 font-bold text-emerald-600">{formatPrice(c.total_spent, locale)}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{formatDate(c.created_at, locale)}</td>
                </tr>
              ))}
              {data.customers.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">{isAr ? 'لا يوجد عملاء' : 'No customers'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
