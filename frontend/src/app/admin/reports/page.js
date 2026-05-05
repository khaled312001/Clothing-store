'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, UserPlus, Receipt, Download, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';
import { LineChart, BarList, DonutChart } from '@/components/admin/Charts';

const PERIODS = [
  { key: '7d',  label_ar: 'آخر 7 أيام',   label_en: 'Last 7 days' },
  { key: '30d', label_ar: 'آخر 30 يوم',  label_en: 'Last 30 days' },
  { key: '90d', label_ar: 'آخر 90 يوم',  label_en: 'Last 90 days' },
  { key: '1y',  label_ar: 'آخر سنة',     label_en: 'Last year' },
];

const PAY_LABEL = {
  cod: 'COD',
  card: 'Card',
  fawry: 'Fawry',
  paymob: 'Paymob',
  vodafone_cash: 'Vodafone Cash',
  instapay: 'InstaPay',
  cash: 'Cash (POS)',
  pos_card: 'Card (POS)',
};

export default function AdminReports() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/reports?period=${period}`).then(setData).finally(() => setLoading(false));
  }, [period]);

  if (loading) return <div className="text-center py-20 text-gray-400">{isAr ? 'جاري التحميل…' : 'Loading…'}</div>;
  if (!data) return <div className="text-center py-20 text-red-500">{isAr ? 'حدث خطأ' : 'Error loading'}</div>;

  const { totals, salesByDay, byCategory, byPayment, byStatus, topProducts, topCustomers, byHour } = data;

  // KPI cards
  const kpis = [
    {
      label: isAr ? 'الإيرادات' : 'Revenue',
      value: formatPrice(totals.revenue.value, locale),
      change: totals.revenue.change,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: isAr ? 'الطلبات' : 'Orders',
      value: totals.orders.value.toLocaleString(),
      change: totals.orders.change,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: isAr ? 'متوسط الطلب' : 'AOV',
      value: formatPrice(totals.aov.value, locale),
      icon: Receipt,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: isAr ? 'عملاء نشطين' : 'Active customers',
      value: totals.customers.value.toLocaleString(),
      icon: Users,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: isAr ? 'عملاء جدد' : 'New customers',
      value: totals.newCustomers.value.toLocaleString(),
      icon: UserPlus,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const exportCSV = () => {
    const rows = [
      ['Day','Revenue','Orders'],
      ...salesByDay.map(d => [d.day, d.revenue, d.orders]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sales-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Period selector + export */}
      <div className="flex flex-wrap items-center justify-between gap-3 card p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-bold text-brand-900">{isAr ? 'الفترة:' : 'Period:'}</span>
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition',
                period === p.key
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700'
              )}
            >
              {isAr ? p.label_ar : p.label_en}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className="btn btn-outline btn-sm">
          <Download className="w-4 h-4" />{isAr ? 'تصدير CSV' : 'Export CSV'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{k.label}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-900 mt-2 truncate">{k.value}</div>
                {typeof k.change === 'number' && (
                  <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-bold', k.change >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {k.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {k.change >= 0 ? '+' : ''}{k.change}%
                    <span className="text-gray-400 font-normal">{isAr ? 'مقارنة بالفترة السابقة' : 'vs prev'}</span>
                  </div>
                )}
              </div>
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shrink-0', k.color)}>
                <k.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales trend chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-900">{isAr ? 'مخطط المبيعات' : 'Sales Trend'}</h3>
          <span className="text-xs text-gray-500">{salesByDay.length} {isAr ? 'يوم' : 'days'}</span>
        </div>
        <div className="h-64">
          <LineChart data={salesByDay} valueKey="revenue" labelKey="day" />
        </div>
      </div>

      {/* Category breakdown + Payment methods */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'الإيرادات حسب القسم' : 'Revenue by category'}</h3>
          <BarList
            items={byCategory.map(c => ({ name: isAr ? c.name_ar : c.name_en, revenue: Number(c.revenue), units: c.units }))}
            valueKey="revenue"
            labelKey="name"
            format={(v) => formatPrice(v, locale)}
            color="bg-gradient-to-r from-brand-500 to-brand-700"
          />
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'طرق الدفع' : 'Payment methods'}</h3>
          <DonutChart
            items={byPayment.map(p => ({ method: PAY_LABEL[p.method] || p.method, revenue: Number(p.revenue), orders: p.orders }))}
            valueKey="revenue"
            labelKey="method"
          />
        </div>
      </div>

      {/* Order status + Hourly */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'الطلبات حسب الحالة' : 'Orders by status'}</h3>
          <BarList
            items={byStatus.map(s => ({ name: s.status, count: s.count }))}
            valueKey="count"
            labelKey="name"
            color="bg-gradient-to-r from-amber-400 to-amber-600"
          />
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'الطلبات حسب الساعة (آخر 30 يوم)' : 'Orders by hour (last 30d)'}</h3>
          <div className="flex items-end gap-1 h-32">
            {Array.from({ length: 24 }).map((_, h) => {
              const v = byHour.find(b => b.hour === h)?.orders || 0;
              const max = Math.max(...byHour.map(b => b.orders), 1);
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-gradient-to-t from-brand-700 to-brand-400 rounded-t group-hover:from-accent-500 group-hover:to-accent-300 transition"
                    style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? 4 : 1 }}
                    title={`${h}:00 — ${v} orders`}
                  />
                  {h % 4 === 0 && <span className="text-[9px] text-gray-400 font-mono">{h}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top products + customers */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'الأكثر مبيعاً' : 'Top selling products'}</h3>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`} target="_blank" className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-50 transition">
                <span className={cn('w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0',
                  i === 0 ? 'bg-amber-400 text-brand-950' : i < 3 ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600')}>{i + 1}</span>
                <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-brand-900 truncate">{isAr ? p.name_ar : p.name_en}</div>
                  <div className="text-xs text-gray-500">{p.units_sold} {isAr ? 'وحدة' : 'units'}</div>
                </div>
                <div className="text-sm font-bold text-emerald-600 whitespace-nowrap">{formatPrice(p.revenue, locale)}</div>
              </Link>
            ))}
            {topProducts.length === 0 && <div className="text-center text-gray-400 py-6 text-sm">{isAr ? 'لا توجد بيانات' : 'No data'}</div>}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-brand-900 mb-4">{isAr ? 'أفضل العملاء (VIP)' : 'Top customers (VIP)'}</h3>
          <div className="space-y-2">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-50 transition">
                <span className={cn('w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0',
                  i === 0 ? 'bg-amber-400 text-brand-950' : i < 3 ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600')}>{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {c.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-brand-900 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500 truncate">{c.email} · {c.orders_count} {isAr ? 'طلب' : 'orders'}</div>
                </div>
                <div className="text-sm font-bold text-emerald-600 whitespace-nowrap">{formatPrice(c.total_spent, locale)}</div>
              </div>
            ))}
            {topCustomers.length === 0 && <div className="text-center text-gray-400 py-6 text-sm">{isAr ? 'لا توجد بيانات' : 'No data'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
