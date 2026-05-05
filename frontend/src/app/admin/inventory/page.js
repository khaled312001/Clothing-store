'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Package, Boxes, TrendingDown, Save, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';

export default function InventoryPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [data, setData] = useState({ variants: [], summary: {} });
  const [lowOnly, setLowOnly] = useState(false);
  const [edits, setEdits] = useState({});  // variant_id -> new stock
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    api.get(`/admin/inventory?${lowOnly ? 'lowOnly=1' : ''}`).then(setData);
  };
  useEffect(load, [lowOnly]);

  const onChange = (id, val) => setEdits({ ...edits, [id]: val });
  const save = async (id) => {
    const newStock = Number(edits[id]);
    if (!Number.isFinite(newStock) || newStock < 0) return;
    setSavingId(id);
    try {
      await api.put(`/admin/inventory/${id}`, { stock: newStock });
      const next = { ...edits };
      delete next[id];
      setEdits(next);
      load();
    } finally { setSavingId(null); }
  };

  const stats = [
    { label: isAr ? 'إجمالي الـvariants' : 'Total variants', value: data.summary.total_variants || 0, icon: Boxes, color: 'from-blue-500 to-blue-600' },
    { label: isAr ? 'إجمالي الوحدات' : 'Total units',         value: (data.summary.total_units || 0).toLocaleString(), icon: Package, color: 'from-emerald-500 to-emerald-600' },
    { label: isAr ? 'مخزون منخفض' : 'Low stock',              value: data.summary.low_stock || 0, icon: TrendingDown, color: 'from-amber-500 to-amber-600' },
    { label: isAr ? 'نفد المخزون' : 'Out of stock',           value: data.summary.out_of_stock || 0, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
                <div className="text-2xl font-extrabold text-brand-900 mt-1">{s.value}</div>
              </div>
              <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-3 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-bold text-brand-900 cursor-pointer">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="rounded" />
          {isAr ? 'عرض المخزون المنخفض فقط (أقل من 5)' : 'Show low stock only (< 5)'}
        </label>
        <span className="text-sm text-gray-500 ms-auto">{data.variants.length} {isAr ? 'متغير' : 'variants'}</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="text-start px-3 py-3">SKU</th>
                <th className="text-start px-3 py-3">{isAr ? 'المقاس/اللون' : 'Size/Color'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'السعر' : 'Price'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'المخزون الحالي' : 'Current'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'تعديل' : 'Edit'}</th>
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v) => {
                const edited = edits[v.id] !== undefined;
                const out = v.stock === 0;
                const low = v.stock > 0 && v.stock < 5;
                return (
                  <tr key={v.id} className={cn('border-t hover:bg-gray-50', out && 'bg-red-50/40', low && 'bg-amber-50/40')}>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {v.image && <Image src={v.image} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-brand-900 line-clamp-1">{isAr ? v.name_ar : v.name_en}</div>
                          <div className="text-xs text-gray-500">{v.category_name_en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{v.sku}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: v.color_hex }} />
                        <span>{isAr ? v.color_name_ar : v.color_name_en} · {v.size}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-bold">{formatPrice(v.price, locale)}</td>
                    <td className="px-3 py-2">
                      <span className={cn('badge font-bold',
                        out ? 'bg-red-100 text-red-700'
                            : low ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700')}>
                        {v.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          defaultValue={v.stock}
                          onChange={(e) => onChange(v.id, e.target.value)}
                          className="input h-8 w-20 text-sm"
                        />
                        <button
                          onClick={() => save(v.id)}
                          disabled={!edited || savingId === v.id}
                          className={cn('btn btn-sm h-8 px-2', edited ? 'btn-primary' : 'btn-ghost')}
                        >
                          {savingId === v.id ? '...' : edited ? <Save className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.variants.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">{isAr ? 'لا توجد بيانات' : 'No data'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
