'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Edit, Eye, Star, Package, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';

export default function AdminProducts() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [data, setData] = useState({ products: [], pagination: { total: 0 } });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (search = '') => {
    setLoading(true);
    api.get(`/admin/products?limit=50${search ? `&q=${encodeURIComponent(search)}` : ''}`)
      .then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e) => { e.preventDefault(); load(q); };

  const toggleActive = async (p) => {
    await api.put(`/admin/products/${p.id}`, { is_active: p.is_active ? 0 : 1 });
    load(q);
  };
  const toggleFeatured = async (p) => {
    await api.put(`/admin/products/${p.id}`, { is_featured: p.is_featured ? 0 : 1 });
    load(q);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <form onSubmit={onSearch} className="card p-3 flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? 'ابحث بالاسم أو SKU…' : 'Search by name or SKU…'} className="input ps-10 h-10" />
          </div>
          <button className="btn btn-primary btn-md">{isAr ? 'بحث' : 'Search'}</button>
        </form>
        <Link href="/admin/products/new" className="btn btn-accent btn-md h-[58px]"><Plus className="w-4 h-4" />{isAr ? 'منتج جديد' : 'New product'}</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b text-sm">
          <span className="font-bold text-brand-900">{data.pagination.total}</span>
          <span className="text-gray-500"> {isAr ? 'منتج' : 'products'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="text-start px-3 py-3">SKU</th>
                <th className="text-start px-3 py-3">{isAr ? 'القسم' : 'Category'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'السعر' : 'Price'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'المخزون' : 'Stock'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'مبيعات' : 'Sold'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-400">{isAr ? 'جاري التحميل…' : 'Loading…'}</td></tr>
              ) : data.products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        {p.image && <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-brand-900 line-clamp-1">{isAr ? p.name_ar : p.name_en}</div>
                        <div className="flex items-center gap-1 text-xs">
                          {Number(p.rating_avg) > 0 && (
                            <><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span>{Number(p.rating_avg).toFixed(1)}</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{p.sku}</td>
                  <td className="px-3 py-3 text-xs">{p.category_name_en}</td>
                  <td className="px-3 py-3 font-bold">{formatPrice(p.price, locale)}</td>
                  <td className="px-3 py-3">
                    <span className={cn('badge', Number(p.total_stock) < 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700')}>
                      {p.total_stock || 0}
                    </span>
                  </td>
                  <td className="px-3 py-3">{p.sales_count}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(p)} className={cn('badge cursor-pointer', p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
                        {p.is_active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}
                      </button>
                      <button onClick={() => toggleFeatured(p)} title={isAr ? 'مميز' : 'Featured'} className={cn('badge cursor-pointer', p.is_featured ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-500')}>
                        ★
                      </button>
                      <Link href={`/admin/products/${p.id}/edit`} className="badge bg-amber-100 text-amber-700"><Edit className="w-3 h-3" /></Link>
                      <Link href={`/product/${p.slug}`} target="_blank" className="badge bg-blue-100 text-blue-700"><Eye className="w-3 h-3" /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
