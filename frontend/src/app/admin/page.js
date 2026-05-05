'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, Clock, TrendingUp, Star, UserPlus, Receipt, BarChart3, Boxes, ScanLine } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI, useAuth } from '@/lib/store';
import { cn, formatPrice, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';

export default function AdminDashboard() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/admin/stats').then(setData).catch(() => {});
  }, [user]);

  if (!data) return <div className="text-center py-12 text-gray-500">{isAr ? 'جاري التحميل…' : 'Loading…'}</div>;

  const { counts, topProducts, recentOrders, salesByDay } = data;
  const maxRev = Math.max(...salesByDay.map(d => Number(d.revenue) || 0), 1);

  const stats = [
    { label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue', value: formatPrice(counts.revenue, locale), icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: isAr ? 'إيرادات آخر 7 أيام' : 'Revenue (7d)', value: formatPrice(counts.revenue_7d || 0, locale), icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
    { label: isAr ? 'الطلبات' : 'Orders', value: counts.orders.toLocaleString(), icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
    { label: isAr ? 'متوسط الطلب' : 'AOV', value: formatPrice(Math.round(counts.aov || 0), locale), icon: Receipt, color: 'from-indigo-500 to-indigo-600' },
    { label: isAr ? 'المنتجات' : 'Products', value: counts.products.toLocaleString(), icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: isAr ? 'العملاء' : 'Customers', value: counts.customers.toLocaleString(), icon: Users, color: 'from-amber-500 to-amber-600' },
    { label: isAr ? 'عملاء جدد (7 أيام)' : 'New customers (7d)', value: counts.new_customers_7d || 0, icon: UserPlus, color: 'from-pink-500 to-pink-600' },
    { label: isAr ? 'تقييمات للمراجعة' : 'Pending reviews', value: counts.pending_reviews || 0, icon: Star, color: 'from-orange-500 to-orange-600' },
  ];

  const quickActions = [
    { href: '/admin/pos',       label: isAr ? 'نقطة البيع' : 'POS',           icon: ScanLine, color: 'bg-accent-400 text-brand-950' },
    { href: '/admin/reports',   label: isAr ? 'التقارير' : 'Reports',          icon: BarChart3, color: 'bg-brand-700 text-white' },
    { href: '/admin/inventory', label: isAr ? 'المخزون' : 'Inventory',         icon: Boxes, color: 'bg-emerald-500 text-white' },
    { href: '/admin/products/new', label: isAr ? 'منتج جديد' : 'New product', icon: Package, color: 'bg-purple-500 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href} className={cn('rounded-2xl p-4 flex items-center gap-3 hover:shadow-card-hover transition-all hover:-translate-y-0.5', a.color)}>
            <a.icon className="w-6 h-6 shrink-0" />
            <span className="font-bold text-sm">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{s.label}</div>
                <div className="text-2xl font-extrabold text-brand-900 mt-2">{s.value}</div>
              </div>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br', s.color)}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3 border-s-4 border-amber-400">
          <Clock className="w-8 h-8 text-amber-500 shrink-0" />
          <div>
            <div className="text-sm text-gray-500">{isAr ? 'طلبات قيد المراجعة' : 'Pending orders'}</div>
            <div className="font-bold text-brand-900 text-lg">{counts.pending_orders}</div>
          </div>
          <Link href="/admin/orders?status=pending" className="ms-auto text-xs text-brand-600 hover:underline">{isAr ? 'عرض' : 'View'}</Link>
        </div>
        <div className="card p-4 flex items-center gap-3 border-s-4 border-red-400">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <div className="text-sm text-gray-500">{isAr ? 'منتجات مخزون منخفض' : 'Low stock variants'}</div>
            <div className="font-bold text-brand-900 text-lg">{counts.low_stock_variants}</div>
          </div>
          <Link href="/admin/products" className="ms-auto text-xs text-brand-600 hover:underline">{isAr ? 'عرض' : 'View'}</Link>
        </div>
      </div>

      {/* Sales chart + top products */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">{isAr ? 'مبيعات آخر 7 أيام' : 'Last 7 days sales'}</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-end gap-2 h-48">
            {salesByDay.length === 0 && <div className="text-sm text-gray-400 self-center mx-auto">{isAr ? 'لا توجد بيانات' : 'No data'}</div>}
            {salesByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-xs font-semibold text-brand-700 opacity-0 group-hover:opacity-100 transition">{formatPrice(d.revenue, locale)}</div>
                <div
                  className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-lg hover:from-accent-500 hover:to-accent-400 transition"
                  style={{ height: `${(Number(d.revenue) / maxRev) * 100}%`, minHeight: 8 }}
                />
                <div className="text-[10px] text-gray-500 font-mono">{new Date(d.day).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'الأكثر مبيعاً' : 'Top sellers'}</h3>
          <div className="space-y-3">
            {topProducts.length === 0 && <div className="text-sm text-gray-400">{isAr ? 'لا توجد بيانات' : 'No data'}</div>}
            {topProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="flex gap-3 hover:bg-brand-50 p-2 -m-2 rounded-lg transition">
                <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {p.image && <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-brand-900 truncate">{isAr ? p.name_ar : p.name_en}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.sales_count} {isAr ? 'طلب' : 'sold'}</div>
                </div>
                <div className="text-sm font-bold text-brand-900 whitespace-nowrap">{formatPrice(p.price, locale)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-900">{isAr ? 'أحدث الطلبات' : 'Recent orders'}</h3>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">{isAr ? 'عرض الكل' : 'View all'}</Link>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-5 py-3">#</th>
                <th className="text-start px-3 py-3">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`} className="font-bold text-brand-700 hover:underline">{o.order_number}</Link></td>
                  <td className="px-3 py-3">{o.customer_name}</td>
                  <td className="px-3 py-3"><span className={cn('badge border', STATUS_COLORS[o.status])}>{STATUS_LABELS[locale][o.status]}</span></td>
                  <td className="px-3 py-3 font-bold">{formatPrice(o.total, locale)}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{formatDate(o.created_at, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
