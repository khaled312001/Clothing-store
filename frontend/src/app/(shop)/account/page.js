'use client';

import { useState } from 'react';
import { Loader2, Save, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';

export default function AccountProfilePage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const { user, refresh } = useAuth();

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/auth/me', form);
      await refresh();
      setMsg({ ok: true, text: locale === 'ar' ? 'تم الحفظ' : 'Saved' });
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally { setSaving(false); }
  };

  return (
    <div className="card p-6">
      <h1 className="text-xl font-bold text-brand-900 mb-1">{t.account.profile}</h1>
      <p className="text-sm text-gray-500 mb-6">{locale === 'ar' ? 'تعديل بياناتك الشخصية' : 'Update your personal info'}</p>

      <form onSubmit={submit} className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.name}</label>
          <input className="input h-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.email}</label>
          <input className="input h-11 bg-gray-50" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.phone}</label>
          <input className="input h-11" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        {msg && (
          <div className={`text-sm flex items-center gap-1.5 ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}
        <button disabled={saving} className="btn btn-primary btn-md">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{t.common.save}
        </button>
      </form>
    </div>
  );
}
