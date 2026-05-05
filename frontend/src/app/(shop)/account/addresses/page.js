'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';

const GOVERNORATES = ['القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','المنوفية','القليوبية'];

export default function AddressesPage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', governorate: GOVERNORATES[0], city: '', street: '', is_default: false });

  const load = () => api.get('/addresses').then(d => setItems(d.addresses));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/addresses', form);
    setOpen(false);
    setForm({ full_name: '', phone: '', governorate: GOVERNORATES[0], city: '', street: '', is_default: false });
    load();
  };

  const remove = async (id) => {
    await api.del(`/addresses/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-900">{t.account.addresses}</h1>
        <button onClick={() => setOpen(v => !v)} className="btn btn-primary btn-sm"><Plus className="w-4 h-4" />{t.common.add}</button>
      </div>

      {open && (
        <form onSubmit={submit} className="card p-4 grid sm:grid-cols-2 gap-3 animate-fade-in">
          <input className="input h-11 sm:col-span-2" placeholder={t.checkout.fullName} required value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
          <input className="input h-11" placeholder={t.checkout.phone} required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          <select className="input h-11" value={form.governorate} onChange={(e) => setForm({...form, governorate: e.target.value})}>
            {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
          </select>
          <input className="input h-11" placeholder={t.checkout.city} required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
          <input className="input h-11" placeholder={t.checkout.street} required value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({...form, is_default: e.target.checked})} />
            {isAr ? 'اجعله العنوان الافتراضي' : 'Set as default'}
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn btn-primary btn-md flex-1">{t.common.save}</button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-outline btn-md">{t.common.cancel}</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          <MapPin className="w-10 h-10 mx-auto text-brand-300 mb-2" />
          {isAr ? 'لا توجد عناوين بعد' : 'No addresses yet'}
        </div>
      ) : items.map(a => (
        <div key={a.id} className="card p-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="font-bold text-brand-900">{a.full_name}</div>
              {a.is_default ? <span className="badge bg-emerald-100 text-emerald-700">{isAr ? 'افتراضي' : 'Default'}</span> : null}
            </div>
            <div className="text-sm text-gray-700 mt-1">{a.phone}</div>
            <div className="text-sm text-gray-700">{a.governorate} · {a.city} · {a.street}</div>
          </div>
          <button onClick={() => remove(a.id)} className="text-red-500 p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
}
