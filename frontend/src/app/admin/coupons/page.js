'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice, formatDate } from '@/lib/utils';

export default function AdminCoupons() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 10, min_order: 0, max_discount: '', description_ar: '', description_en: '', is_active: true });

  const load = () => api.get('/admin/coupons').then(d => setCoupons(d.coupons));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/admin/coupons', form);
    setOpen(false);
    setForm({ code: '', type: 'percentage', value: 10, min_order: 0, max_discount: '', description_ar: '', description_en: '', is_active: true });
    load();
  };

  const remove = async (id) => {
    if (!confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
    await api.del(`/admin/coupons/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-900">{coupons.length} {isAr ? 'كوبون' : 'coupons'}</h2>
        <button onClick={() => setOpen(v => !v)} className="btn btn-primary btn-md"><Plus className="w-4 h-4" />{isAr ? 'كوبون جديد' : 'New coupon'}</button>
      </div>

      {open && (
        <form onSubmit={submit} className="card p-4 grid sm:grid-cols-2 gap-3 animate-fade-in">
          <input className="input h-10" placeholder={isAr ? 'الكود' : 'Code'} required value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} />
          <select className="input h-10" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
            <option value="percentage">{isAr ? 'نسبة %' : 'Percentage %'}</option>
            <option value="fixed">{isAr ? 'مبلغ ثابت' : 'Fixed amount'}</option>
          </select>
          <input type="number" className="input h-10" placeholder={isAr ? 'القيمة' : 'Value'} required value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} />
          <input type="number" className="input h-10" placeholder={isAr ? 'الحد الأدنى للطلب' : 'Min order'} value={form.min_order} onChange={(e) => setForm({...form, min_order: e.target.value})} />
          <input type="number" className="input h-10" placeholder={isAr ? 'أقصى خصم' : 'Max discount'} value={form.max_discount} onChange={(e) => setForm({...form, max_discount: e.target.value})} />
          <input className="input h-10" placeholder={isAr ? 'الوصف' : 'Description'} value={form.description_ar} onChange={(e) => setForm({...form, description_ar: e.target.value, description_en: e.target.value})} />
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn btn-primary btn-md flex-1">{isAr ? 'حفظ' : 'Save'}</button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-outline btn-md">{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{isAr ? 'الكود' : 'Code'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'النوع' : 'Type'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'القيمة' : 'Value'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الحد الأدنى' : 'Min order'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'الاستخدام' : 'Used'}</th>
                <th className="text-start px-3 py-3">{isAr ? 'تاريخ الانتهاء' : 'Expires'}</th>
                <th className="text-start px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3"><code className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-bold">{c.code}</code></td>
                  <td className="px-3 py-3"><span className="badge bg-purple-100 text-purple-700">{c.type}</span></td>
                  <td className="px-3 py-3 font-bold">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value, locale)}</td>
                  <td className="px-3 py-3">{c.min_order > 0 ? formatPrice(c.min_order, locale) : '—'}</td>
                  <td className="px-3 py-3">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{c.expires_at ? formatDate(c.expires_at, locale) : '∞'}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => remove(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
