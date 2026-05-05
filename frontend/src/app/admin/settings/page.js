'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';

export default function AdminSettings() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/settings').then(d => setSettings(d.settings || {}));
  }, []);

  const update = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/settings', settings);
      setMsg({ ok: true, text: isAr ? 'تم الحفظ' : 'Saved' });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setSaving(false); }
  };

  const fields = [
    { key: 'site_name_ar', label: isAr ? 'اسم المتجر (عربي)' : 'Site name (Arabic)' },
    { key: 'site_name_en', label: isAr ? 'اسم المتجر (إنجليزي)' : 'Site name (English)' },
    { key: 'contact_phone', label: isAr ? 'رقم الهاتف' : 'Phone' },
    { key: 'contact_email', label: isAr ? 'البريد الإلكتروني' : 'Email' },
    { key: 'contact_whatsapp', label: 'WhatsApp' },
    { key: 'default_shipping_fee', label: isAr ? 'رسوم الشحن الافتراضية' : 'Default shipping fee', type: 'number' },
    { key: 'free_shipping_threshold', label: isAr ? 'حد الشحن المجاني' : 'Free shipping threshold', type: 'number' },
    { key: 'currency', label: isAr ? 'العملة' : 'Currency' },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="card p-6 grid sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className={f.key.includes('site_name') ? '' : 'sm:col-span-1'}>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{f.label}</label>
            <input
              className="input h-11"
              type={f.type || 'text'}
              value={settings[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
            />
          </div>
        ))}
        {msg && (
          <div className={`sm:col-span-2 text-sm flex items-center gap-1.5 ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}
        <div className="sm:col-span-2">
          <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isAr ? 'حفظ الإعدادات' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
