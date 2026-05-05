'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn, formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';

export default function MyOrdersPage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(d => setOrders(d.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">{t.common.loading}</div>;

  if (orders.length === 0) return (
    <div className="card p-12 text-center">
      <Package className="w-12 h-12 mx-auto text-brand-300 mb-3" />
      <h2 className="font-bold text-brand-900 mb-1">{t.account.noOrders}</h2>
      <p className="text-sm text-gray-500 mb-4">{isAr ? 'ابدأ التسوق الآن' : 'Start shopping now'}</p>
      <Link href="/" className="btn btn-primary btn-md">{isAr ? 'تسوق الآن' : 'Shop now'}</Link>
    </div>
  );

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-brand-900 mb-2">{t.account.myOrders}</h1>
      {orders.map(o => (
        <Link key={o.id} href={`/account/orders/${o.id}`} className="card p-4 flex items-center justify-between hover:shadow-card-hover transition">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><Package className="w-5 h-5" /></div>
            <div>
              <div className="font-bold text-brand-900">{o.order_number}</div>
              <div className="text-xs text-gray-500">{formatDate(o.created_at, locale)}</div>
            </div>
          </div>
          <div className="text-end">
            <div className={cn('badge border', STATUS_COLORS[o.status])}>{STATUS_LABELS[locale][o.status]}</div>
            <div className="font-bold text-brand-900 mt-1">{formatPrice(o.total, locale)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
